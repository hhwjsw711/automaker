import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AssignmentViewerProps {
  assignments: string[];
}

export function AssignmentViewer({ assignments }: AssignmentViewerProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{t("learn.assignments")}</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-500 italic">{t("learn.noAssignments")}</p>
      ) : (
        <ul className="space-y-2">
          {assignments.map((assignment, index) => (
            <li key={index}>
              <a
                href={assignment}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <FileText className="mr-2" size={20} />
                {t("learn.assignmentLabel")}{index + 1}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
