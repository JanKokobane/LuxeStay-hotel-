import React from 'react';
import styles from './Dashboard.module.css';

function ReportsSection() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Reports</h2>
      </div>
      <div className={styles.emptyState}>
        <p>Reports will be displayed here</p>
      </div>
    </div>
  );
}

export default ReportsSection;
