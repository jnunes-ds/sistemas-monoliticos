import {app} from "@shared/infrastructure/api/express";

const PORT = 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));