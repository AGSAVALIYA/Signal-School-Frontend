import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';




const ExportAttendanceButton = ({ attendanceData }) => {

    const handleExportPDF = () => {
        const doc = new jsPDF('p', 'pt'); // Create PDF document in portrait mode
        const margin = 40; // Margin for the content
        const startY = 40; // Initial y position for text

        // Set up styles
        doc.setFontSize(16); // Set the overall font size to 16
        doc.text('Attendance Report', margin, startY);

        let y = startY + 30; // Initial y position for content
        const cellPadding = 8; // Adjusted cell padding for better spacing
        const cellWidth = 250;
        const cellHeight = 30; // Increased cell height for better readability

        // Loop through each date in attendanceData
        Object.keys(attendanceData).forEach((date, index) => {
            // Draw date header
            doc.setFontSize(12); // Set font size for the date header
            doc.setFillColor(240, 240, 240); // Light gray background
            doc.setTextColor(0); // Set text color to black
            doc.setDrawColor(100, 100, 100); // Dark gray border color
            doc.rect(margin, y, cellWidth, cellHeight, 'FD'); // Draw filled rectangle with border
            doc.text(date, margin + cellPadding, y + cellHeight - cellPadding);

            y += cellHeight; // Move to next row

            // Draw attendance records for this date
            attendanceData[date].forEach((record) => {
                // Draw student name cell
                doc.setFontSize(10); // Set font size for student name
                doc.setFillColor(255, 255, 255); // White background for name cell
                doc.rect(margin, y, cellWidth / 2, cellHeight, 'FD'); // Draw filled rectangle with border for name
                doc.text(record.Student.name, margin + cellPadding, y + cellHeight / 2, { align: 'left', baseline: 'middle' });

                // Draw status cell
                doc.setFontSize(10); // Set font size for status
                doc.setFillColor(255, 255, 255); // White background for status cell
                doc.rect(margin + cellWidth / 2, y, cellWidth / 2, cellHeight, 'FD'); // Draw filled rectangle with border for status
                doc.text(record.status, margin + cellWidth / 2 + cellPadding, y + cellHeight / 2, { align: 'left', baseline: 'middle' });

                y += cellHeight; // Move to next row
            });

            y += cellPadding; // Add padding after each date
        });

        // Output the PDF
        doc.save('attendance_report.pdf');
    };
    return (
        <Button variant="contained" onClick={handleExportPDF} size='small'>
            Export PDF
        </Button>
    );
}

export default ExportAttendanceButton;