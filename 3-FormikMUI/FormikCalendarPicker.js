// import { useNavigate } from "react-router-dom";

import { useField } from "formik";

import CalendarPicker from "@mui/lab/CalendarPicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

export default function FormikCalendarPicker({
  name,
  selectedDate,
  ...otherProps
}) {
  const [field, meta] = useField(name);
  // let navigate = useNavigate();

  const changeHandler = (value) => {
    console.log(value);
  };

  const configCalendarPicker = {
    ...field,
    ...otherProps,
    date: selectedDate,
    onChange: (value) => changeHandler(value),
    // choose same date = true?
  };

  if (meta && meta.touched && meta.error) {
    configCalendarPicker.error = true;
    configCalendarPicker.helperText = meta.error;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CalendarPicker {...configCalendarPicker} />
    </LocalizationProvider>
  );
}
