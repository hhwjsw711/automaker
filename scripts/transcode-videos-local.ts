/**
 * 本地视频转码脚本
 *
 * 功能：
 * 1. 扫描 R2 bucket 中的原始视频文件
 * 2. 检查哪些缺少 720p/480p 转码版本
 * 3. 本地 FFmpeg 转码后上传回 R2
 *
 * 用法：
 *   npx tsx scripts/transcode-videos-local.ts            # 扫描并转码所有缺失的
 *   npx tsx scripts/transcode-videos-local.ts --dry-run  # 仅扫描，不执行转码
 *   npx tsx scripts/transcode-videos-local.ts --quality 720p  # 只转码 720p
 *   npx tsx scripts/transcode-videos-local.ts --key xxx.mp4    # 只处理指定 key
 */

import { config } from "dotenv";
import { resolve } from "node:path";

// 加载项目根目录的 .env 文件
config({ path: resolve(import.meta.dirname, "..", ".env") });

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, unlink, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const execAsync = promisify(exec);

// ─── 配置 ───────────────────────────────────────────────
const FFMPEG_PRESET = "medium";
const FFMPEG_CRF = "23";
const QUALITIES: ("720p" | "480p")[] = ["720p", "480p"];

// ─── 参数解析 ────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const qualityFilter = args.find((a) => a.startsWith("--quality="))?.split("=")[1] as
  | "720p"
  | "480p"
  | undefined;
const specificKey = args.find((a) => a.startsWith("--key="))?.split("=")[1];

const selectedQualities = qualityFilter ? [qualityFilter] : QUALITIES;

// ─── R2 客户端 ──────────────────────────────────────────
function createR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    console.error("错误：请在 .env 中配置 R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET");
    process.exit(1);
  }

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { client, bucket };
}

// ─── 辅助函数 ───────────────────────────────────────────

function getVideoQualityKey(baseKey: string, quality: "720p" | "480p"): string {
  return baseKey.replace(".mp4", `_${quality}.mp4`);
}

function isOriginalVideo(key: string): boolean {
  // 只处理 .mp4 文件，排除已转码的和缩略图
  if (!key.endsWith(".mp4")) return false;
  if (key.includes("_720p.") || key.includes("_480p.")) return false;
  if (key.includes("_thumb.")) return false;
  return true;
}

async function objectExists(client: S3Client, bucket: string, key: string): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error: any) {
    if (error.$metadata?.httpStatusCode === 404 || error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}

async function downloadToFile(
  client: S3Client,
  bucket: string,
  key: string,
  localPath: string
): Promise<number> {
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!response.Body) throw new Error(`下载失败: ${key}`);

  const chunks: Uint8Array[] = [];
  const stream = response.Body as AsyncIterable<Uint8Array>;
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  await writeFile(localPath, buffer);
  return buffer.length;
}

async function uploadFile(
  client: S3Client,
  bucket: string,
  key: string,
  localPath: string,
  contentType: string = "video/mp4"
): Promise<void> {
  const buffer = await readFile(localPath);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
}

async function transcode(inputPath: string, outputPath: string, quality: "720p" | "480p"): Promise<void> {
  const targetHeight = quality === "720p" ? "720" : "480";
  const command = `ffmpeg -i "${inputPath}" -vf "scale=-2:${targetHeight}" -c:v libx264 -preset ${FFMPEG_PRESET} -crf ${FFMPEG_CRF} -c:a aac -y "${outputPath}"`;

  console.log(`  [FFmpeg] 转码 ${quality}...`);
  const start = Date.now();
  await execAsync(command);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  [FFmpeg] ${quality} 完成，耗时 ${elapsed}s`);
}

async function cleanupFile(...paths: string[]): Promise<void> {
  await Promise.allSettled(
    paths.map(async (path) => {
      try {
        await unlink(path);
      } catch {
        // ignore
      }
    })
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── 主流程 ─────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   本地视频转码工具 (R2 → FFmpeg → R2)    ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log();

  const { client, bucket } = createR2Client();
  console.log(`R2 Bucket: ${bucket}`);
  console.log(`目标画质: ${selectedQualities.join(", ")}`);
  if (isDryRun) console.log("模式: DRY RUN (仅扫描，不执行转码)");
  if (specificKey) console.log(`指定文件: ${specificKey}`);
  console.log();

  // 1. 列出 R2 中所有对象
  console.log("[1/4] 扫描 R2 bucket 中的文件...");
  const allKeys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of response.Contents ?? []) {
      if (obj.Key) allKeys.push(obj.Key);
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log(`  共 ${allKeys.length} 个文件`);

  // 2. 筛选原始视频
  const originalVideos = specificKey
    ? [specificKey].filter(isOriginalVideo)
    : allKeys.filter(isOriginalVideo);

  console.log(`  其中 ${originalVideos.length} 个原始视频文件`);
  console.log();

  if (originalVideos.length === 0) {
    console.log("没有需要处理的视频文件。");
    return;
  }

  // 3. 检查缺失的转码版本
  console.log("[2/4] 检查转码版本...");
  const tasks: { key: string; quality: "720p" | "480p"; qualityKey: string }[] = [];

  for (const videoKey of originalVideos) {
    for (const quality of selectedQualities) {
      const qualityKey = getVideoQualityKey(videoKey, quality);
      const exists = await objectExists(client, bucket, qualityKey);

      if (exists) {
        console.log(`  ✓ ${qualityKey} 已存在`);
      } else {
        console.log(`  ✗ ${qualityKey} 缺失`);
        tasks.push({ key: videoKey, quality, qualityKey });
      }
    }
  }

  console.log();
  console.log(`共 ${tasks.length} 个转码任务待执行`);

  if (tasks.length === 0) {
    console.log("所有视频都已有对应的转码版本，无需处理。");
    return;
  }

  if (isDryRun) {
    console.log();
    console.log("[DRY RUN] 以下任务将被执行：");
    for (const task of tasks) {
      console.log(`  ${task.key} → ${task.qualityKey}`);
    }
    return;
  }

  // 4. 执行转码
  console.log();
  console.log("[3/4] 开始转码...");
  const tempDir = join(tmpdir(), "video-transcode");
  await mkdir(tempDir, { recursive: true });

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log();
    console.log(`── 任务 ${i + 1}/${tasks.length}: ${task.key} → ${task.quality} ──`);

    const tempOriginal = join(tempDir, `original_${Date.now()}.mp4`);
    const tempOutput = join(tempDir, `output_${Date.now()}_${task.quality}.mp4`);

    try {
      // 下载原始视频
      console.log(`  下载原始视频: ${task.key}`);
      const downloadStart = Date.now();
      const bytes = await downloadToFile(client, bucket, task.key, tempOriginal);
      const downloadTime = ((Date.now() - downloadStart) / 1000).toFixed(1);
      console.log(`  下载完成: ${formatBytes(bytes)}，耗时 ${downloadTime}s`);

      // 转码
      await transcode(tempOriginal, tempOutput, task.quality);

      // 上传转码结果
      console.log(`  上传转码结果: ${task.qualityKey}`);
      await uploadFile(client, bucket, task.qualityKey, tempOutput);

      console.log(`  ✓ 完成: ${task.qualityKey}`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ 失败: ${task.key} → ${task.quality}`);
      console.error(`  错误: ${error instanceof Error ? error.message : String(error)}`);
      failCount++;
    } finally {
      // 清理临时文件
      await cleanupFile(tempOriginal, tempOutput);
    }
  }

  // 5. 汇总
  console.log();
  console.log("[4/4] 完成");
  console.log(`  成功: ${successCount}`);
  console.log(`  失败: ${failCount}`);
  console.log(`  总计: ${tasks.length}`);

  if (failCount === 0) {
    console.log();
    console.log("所有转码任务已完成，生产环境可直接播放。");
  }
}

main().catch((error) => {
  console.error("脚本执行失败:", error);
  process.exit(1);
});
