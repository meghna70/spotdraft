import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import {
    CircularProgressbar,
   
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


const percentage = 66;
export default function StoragePercent() {
    return (
        <CssVarsProvider>
            <Card
                sx={{
                    width: 400,
                    height: 300,
                    borderRadius: 'md',
                    boxShadow: 'lg',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    padding: 1,
                    marginBottom:3,
                }}
            >
                <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                    <CircularProgressbar value={percentage} text={`${percentage}%`} />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        width: '100%',
                        mt: 1,
                    }}
                >
                    <Box textAlign="center">
                        <Typography level="body-sm">Shared files</Typography>
                        <Typography level="title-md" fontWeight="lg">25 MB</Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography level="body-sm">Uploaded files</Typography>
                        <Typography level="title-md" fontWeight="lg">2 GB</Typography>
                    </Box>
                </Box>
            </Card>
        </CssVarsProvider>
    );
}
