"use client";
import * as React from "react";
import { useLocation } from "react-router-dom";
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { jsPDF } from "jspdf";
import "../styles/Certificate.css";

function Certificate() {
  const location = useLocation();
  const {
    recipientName = "Bhagyashree Patil",
    courseTitle = "Introduction to Web Development",
    completionDescription = `For successfully completing the course on ${new Date().toLocaleDateString()}`,
    companyLogo = "https://cdn.builder.io/api/v1/image/assets/TEMP/4f6fe8d3c65a4c26921a35c4c4c78ff73823d3ec?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c",
    companyNameLogo = "https://cdn.builder.io/api/v1/image/assets/TEMP/963b29c4787ff6a3808474d57e9ed7d684746a24?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c",
    companyName = "E-LERN App",
  } = location.state || {};

  const certificateRef = React.useRef(null);

  const waitForRender = () => new Promise((resolve) => setTimeout(resolve, 500));

  const downloadAsImage = async (format = 'png') => {
    if (!certificateRef.current) return;
    
    try {
      await waitForRender();
      let dataUrl;
      const options = {
        width: 1220,
        height: 620,
        canvasWidth: 1220,
        canvasHeight: 620,
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '2000px',
          height: '620px',
          overflow: 'visible',
          boxSizing: 'border-box',
        },
        filter: (node) => {
          return !node.classList?.contains('download-controls');
        },
      };
      
      switch(format) {
        case 'png':
          dataUrl = await toPng(certificateRef.current, options);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(certificateRef.current, options);
          break;
        case 'svg':
          dataUrl = await toSvg(certificateRef.current, options);
          break;
        default:
          dataUrl = await toPng(certificateRef.current, options);
      }

      const link = document.createElement('a');
      link.download = `certificate-${recipientName.replace(/\s+/g, '-')}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating certificate image. Please try again.');
    }
  };

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;
    
    try {
      await waitForRender();
      const dataUrl = await toPng(certificateRef.current, {
        width: 1220,
        height: 620,
        canvasWidth: 1220,
        canvasHeight: 620,
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '1220px',
          height: '620px',
          overflow: 'visible',
          boxSizing: 'border-box',
        },
        filter: (node) => {
          return !node.classList?.contains('download-controls');
        },
      });
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${recipientName.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="certificate-wrapper">
      <div className="download-controls">
        <h2>Download Certificate</h2>
        <div className="button-group">
          <button className="download-btn" onClick={() => downloadAsImage('png')}>
            PNG
          </button>
          <button className="download-btn" onClick={() => downloadAsImage('jpeg')}>
            JPEG
          </button>
          <button className="download-btn" onClick={downloadAsPDF}>
            PDF
          </button>
        </div>
      </div>

      <section className="certificate-container" ref={certificateRef}>
        <header className="header-container">
          <img src={companyLogo} className="company-logo" alt={`${companyName} Logo`} />
          <div className="title-container">
            <h1 className="certificate-title">CERTIFICATE</h1>
            <h2 className="certificate-subtitle">OF COURSE COMPLETION</h2>
          </div>
          <div className="company-info">
            <p className="company-name">{companyName}</p>
          </div>
        </header>

        <div className="certificate-body">
          <aside className="dots-container">
            <div className="dots-row">
              <span className="dot"></span>
            </div>
            <div className="dots-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <div className="dots-row">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <div className="dots-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </aside>

          <article className="content-container">
            <div className="certificate-text">
              <h2 className="award-title">{courseTitle}</h2>
              <p className="presented-text">proudly presented to</p>
              <h3 className="recipient-name">{recipientName}</h3>
              <p className="achievement-description">{completionDescription}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Certificate;