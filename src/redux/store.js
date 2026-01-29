import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./CourseSlice";
import categoryReducer from "./categorySlice";
import softwareReducer from "./softwareSlice";
import websiteReducer from "./websiteSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import downloadReducer from "./downloadSlice";
import enrollmentReducer from "./enrollmentSlice";

import designTemplateReducer from "./designTemplateSlice";
import reviewReducer from "./reviewSlice";
import blogReducer from "./blogSlice";

export default configureStore({
  reducer: {
    courses: courseReducer,
    categories: categoryReducer,
    designTemplates: designTemplateReducer,
    software: softwareReducer,
    websites: websiteReducer,
    cart: cartReducer,
    order: orderReducer,
    download: downloadReducer,
    enrollment: enrollmentReducer,
    reviews: reviewReducer,
    blogs: blogReducer,
  },
});



