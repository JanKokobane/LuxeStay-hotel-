import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendar.module.css';
import React from 'react';

interface CalendarProps {
  mode: 'single';
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
}

export const Calendar = ({ selected, onSelect, disabled }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    if (!disabled) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return disabled(date);
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDisabled(day)) {
      onSelect(date);
    }
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const selected = isSelected(day);
    const disabled = isDisabled(day);

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDayClick(day)}
        disabled={disabled}
        className={`${styles.day} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button type="button" onClick={previousMonth} className={styles.navButton}>
          <ChevronLeft size={16} />
        </button>
        <div className={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button type="button" onClick={nextMonth} className={styles.navButton}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={styles.weekdays}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>
      <div className={styles.days}>
        {days}
      </div>
    </div>
  );
};
