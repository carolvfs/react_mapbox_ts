// DrawerContent.jsx
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const title = "Drawer Content"
const subtitle = "This is some content inside the drawer."

const DrawerContent = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">
        {subtitle}
      </Typography>
      {/* Add more content as needed */}
    </Box>
  )
}

export default DrawerContent
