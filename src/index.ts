import app from "./app";
import ENV from "./config/env";

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
