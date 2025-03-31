import express from 'express';
import cors from 'cors';
import { excelRouter } from './routes/excelRoutes'; // Changed from default import to named import

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/excel', excelRouter); // Use the named export

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});