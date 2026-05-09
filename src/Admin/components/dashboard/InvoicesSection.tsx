import React from 'react';
import styles from './Dashboard.module.css';

function InvoicesSection() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Invoices</h2>
      </div>
      <div className={styles.emptyState}>
        <p>Invoices will be displayed here</p>
      </div>
    </div>
  );
}

export default InvoicesSection;
