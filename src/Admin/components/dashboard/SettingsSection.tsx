import React from 'react';
import styles from './Dashboard.module.css';

function SettingsSection() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Settings</h2>
      </div>
      <div className={styles.emptyState}>
        <p>Application settings will be displayed here</p>
      </div>
    </div>
  );
}

export default SettingsSection;
