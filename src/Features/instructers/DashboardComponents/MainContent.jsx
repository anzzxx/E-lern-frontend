'use client';
import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import { useSelector } from 'react-redux';
import styles from '../../../styles/MainContent.module.css';
import PurchaseHistoryTable from './PurchaseHistoryTable';
import CourseSalesTrendChart from './CourseSalesTrendChart';

const MainContent = () => {
  const { selectedInstructor } = useSelector((state) => state.instructors);
  const { instructorCourses } = useSelector((state) => state.courses);
  const { avgRating, totalEarnings, studentsCount, loading } = useSelector((state) => state.instructorDashboard);
  const instructor = selectedInstructor?.data || {};

  // Function to get dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <div className={styles.mainContent}></div>;
  }

  return (
    <section className={styles.mainContent}>
      <header>
        <div>
          <h2>
            {getGreeting()}, <span>{instructor.name || 'Instructor'}</span>
          </h2>
          
        </div>
      </header>

      <section className={styles.statsSection}>
        <StatsCard
          type="revenue"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ba974a23dff7af2a6bcb630110e43de2c8c2d550"
          title="Total Revenue"
          value={totalEarnings}
          bgColor="#fff7ed"
        />
        <StatsCard
          type="ratings"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/5d74167e123d72ec86f34413750c2b737775b962"
          title="Average Rating"
          value={`${avgRating}/5`}
          bgColor="#f4f6dc"
        />
        <StatsCard
          type="students"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/78b05c95266d781689a3e739c8efe17affef2767"
          title="Total Student"
          value={studentsCount}
          bgColor="#dff3e9"
        />
        <StatsCard
          type="course"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/329061b27f456a8558e3d38f3c4e62409df09332"
          title="Total Course"
          value={instructorCourses.length}
          bgColor="#fff8e0"
        />
      </section>

      <section className={styles.overviewSection}>
        
      </section>
      <CourseSalesTrendChart />
      <br />
      <PurchaseHistoryTable />
    </section>
  );
};

export default MainContent;