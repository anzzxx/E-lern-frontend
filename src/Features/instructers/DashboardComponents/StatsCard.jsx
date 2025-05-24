"use client";
import React from "react";
import styles from "../../../styles/StatsCard.module.css";

const StatsCard = ({ type, icon, title, value, bgColor }) => {
  const containerClass =
    type === "students"
      ? styles.containerStudents
      : type === "course"
      ? styles.containerCourse
      : styles.containerDefault;

  return (
    <article className={styles.card}>
      <div
        className={containerClass}
        style={bgColor ? { backgroundColor: bgColor } : {}}
      >
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <img className={styles.icon} src={icon} alt={title} />
          </div>
          <div className={styles.textWrapper}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.value}>{value}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StatsCard;