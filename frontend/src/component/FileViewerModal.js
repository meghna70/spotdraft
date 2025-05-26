import React, { useEffect, useState } from 'react';

const FileViewerModal = ({ file_data, token, isOpen, onClose }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchFile = async () => {
      try {
        const response = await fetch(`/api/files/view/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch file');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFile();

     return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
        setFileUrl(null);
      }
    };
  }, [fileId, token, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        {fileUrl ? (
          <iframe
            src={fileUrl}
            title="File Viewer"
            style={styles.iframe}
          />
        ) : (
          <p>Loading file...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    width: '80vw',
    height: '80vh',
    backgroundColor: '#fff',
    borderRadius: 8,
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 15,
    fontSize: 24,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
};

export default FileViewerModal;
