import type { JSX } from "react";
import styles from "./attached-files.module.scss";

interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  downloadUrl: string;
}

interface AttachedFilesProps {
  files: AttachedFile[];
}

const getFileIcon = (type: string): JSX.Element => {
  switch (type.toLowerCase()) {
    case "pdf":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "zip":
    case "rar":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
      );
  }
};

const getFileColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "#e35c33";
    case "zip":
    case "rar":
      return "#f59e0b";
    case "doc":
    case "docx":
      return "#3b82f6";
    default:
      return "#64748b";
  }
};

export default function AttachedFiles({ files }: AttachedFilesProps) {
  if (files.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
        <p>No files attached to this lecture.</p>
      </div>
    );
  }

  return (
    <div className={styles.attachedFiles}>
      <ul className={styles.fileList}>
        {files.map((file) => (
          <li key={file.id} className={styles.fileItem}>
            <div
              className={styles.fileIcon}
              style={{ color: getFileColor(file.type) }}
            >
              {getFileIcon(file.type)}
            </div>

            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileMeta}>
                {file.type.toUpperCase()} • {file.size}
              </span>
            </div>

            <a
              href={file.downloadUrl}
              className={styles.downloadBtn}
              download
              aria-label={`Download ${file.name}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}