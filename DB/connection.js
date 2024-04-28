import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL_ATLAS)
    .then((res) => console.log(`DB Connected.........`))
    .catch((err) => console.log(`Fail to Connect on your DB ......... ${err}`));
};
export default connectDB;
