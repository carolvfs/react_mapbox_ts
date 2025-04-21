export function downloadInclinationCsv(dataArray) {
    // CSV header
    const header = ['latitude', 'longitude', 'slopePercent'];
    
    // Build rows, rounding lat/lng to 6 decimals (slope is already to 4)
    const rows = dataArray.map(({ coord, slopePercent }) => {
      const [lng, lat] = coord;
      const lat6 = lat.toFixed(6);
      const lng6 = lng.toFixed(6);
      return [lat6, lng6, slopePercent];
    });
  
    // Combine header + rows into CSV string
    const csvContent = [
      header.join(','), 
      ...rows.map(r => r.join(','))
    ].join('\r\n');
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'inclinations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  