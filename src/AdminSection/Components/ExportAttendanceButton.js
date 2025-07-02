import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';

/**
 * ExportAttendanceButton Component
 * 
 * A specialized button component that exports attendance data to PDF format.
 * This component provides administrators with the ability to generate
 * professional PDF reports of student attendance records.
 * 
 * Features:
 * - Generates PDF documents using jsPDF library
 * - Professional formatting with margins and page numbering
 * - Multi-page support for large attendance datasets
 * - Proper page breaks and footer management
 * - Responsive layout that adapts to content size
 * - Download functionality for generated PDFs
 * 
 * The component creates a well-formatted PDF with:
 * - Header information
 * - Tabular attendance data
 * - Page numbers and pagination
 * - Professional styling and spacing
 * 
 * Props:
 * @param {Array} attendanceData - Array of attendance records to export
 */
const ExportAttendanceButton = ({ attendanceData }) => {

    /**
     * Handles the PDF export functionality
     * 
     * Creates a PDF document with attendance data, properly formatted
     * with pagination, headers, and professional styling.
     */
    const handleExportPDF = () => {
        const doc = new jsPDF('p', 'pt'); // Create PDF document in portrait mode
        const margin = 40; // Margin for the content
        const startY = 40; // Initial y position for text

        const pageHeight = doc.internal.pageSize.height; // Height of the PDF page
        let currentPage = 1; // Current page number

        /**
         * Adds page footer with page numbering to all pages
         * 
         * This function iterates through all pages in the document
         * and adds consistent footer information including page numbers.
         */
        const addPageFooter = () => {
            const totalPages = doc.internal.getNumberOfPages(); // Total pages in the document

            // Iterate over each page to add footer
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i); // Set current page

                // Footer content with page numbering
                const footerText = `Page ${i} of ${totalPages}`;
                const footerX = margin; // X position (left-aligned)
                const footerY = pageHeight - 20; // Y position (bottom margin)

                // Set font size and add footer text
                doc.setFontSize(10);
                doc.text(footerText, footerX, footerY, { align: 'left' });
            }
        };

        // Set up styles
        doc.setFontSize(16); // Set the overall font size to 16
        doc.text('Attendance Report', margin, startY);

        let y = startY + 30; // Initial y position for content
        const cellPadding = 8; // Adjusted cell padding for better spacing
        const cellWidth = 250;
        const cellHeight = 30; // Increased cell height for better readability

        // Loop through each date in attendanceData
        Object.keys(attendanceData).forEach((date, index) => {
            // Check if there's enough space on the current page for this date
            if (y + cellHeight > pageHeight - margin) {
                // Add new page
                doc.addPage();
                currentPage++;

                // Reset y position for the new page
                y = margin;
            }

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
                // Check if there's enough space for the current record
                if (y + cellHeight > pageHeight - margin) {
                    // Add new page
                    doc.addPage();
                    currentPage++;

                    // Reset y position for the new page
                    y = margin;
                }

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

        // Add page footer with page numbers
        addPageFooter();

        // Output the PDF
        doc.save(`attendance_report.pdf`);
    };

    return (
        <Button variant="contained" onClick={handleExportPDF} disabled={!attendanceData || Object.keys(attendanceData).length === 0}>
            Export PDF
        </Button>
    );
}

export default ExportAttendanceButton;
