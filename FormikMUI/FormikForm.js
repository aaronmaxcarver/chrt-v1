import { Formik, Form } from "formik";
import * as Yup from "yup";

import FormikTextField from "../FormikMUI/FormikTextField";
import FormikButton from "./FormikButton";

import Box from "@mui/material/Box";

const GRID_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: "100%",
  gridTemplateColumns: "100%",
  gridTemplateAreas: `"inputForm"`,
};

const INPUT_SX = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

//-- This is an example Formik Form to be used as a reference and/or snippet gallery --//

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  // country: "",
  // dateTimePickerDate: "",
  // calendarPickerDate: "",
  // termsOfService: "",
};

const FORM_VALIDATION = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email.").required("Required"),
  // country: Yup.string().required("Required"),
  // dateTimePickerDate: Yup.date().required("Required"),
  // calendarPickerDate: Yup.date().required("Required"),
  // termsOfService: Yup.boolean()
  //   .oneOf([true], "The terms and conditions must be accepted.")
  //   .required("The terms and conditions must be accepted."),
});

export default function FormikForm() {
  return (
    <Box sx={GRID_SX}>
      <Box sx={INPUT_SX}>
        <div
          className="FormikForm" // Styling not working
        >
          <Formik
            initialValues={{ ...INITIAL_FORM_STATE }}
            validationSchema={FORM_VALIDATION}
            onSubmit={async (values) => {
              // await new Promise((r) => setTimeout(r, 0));
              console.log(JSON.stringify(values, null, 2));
            }}
          >
            <Form>
              <FormikTextField
                name="firstName"
                label="First Name"
                sx={{ marginBottom: "12px" }}
              />
              <FormikTextField
                name="lastName"
                label="Last Name"
                sx={{ marginBottom: "12px" }}
              />
              <FormikTextField
                name="email"
                label="Email"
                sx={{ marginBottom: "12px" }}
              />
              {/* <FormikSelect
                name="country"
                label="Country"
                options={countries}
                sx={{ marginBottom: "12px" }}
              />
              <FormikDateTimePicker
                name="dateTimePickerDate"
                label="DateTime Picker Date"
                sx={{ marginBottom: "12px" }}
              />
              <FormikCalendarPicker // seems to work
                name="calendarPickerDate"
                label="Calendar Picker Date"
                sx={{ marginBottom: "12px" }}
              />
              <FormikCheckbox
                name="termsOfService"
                legend="Terms of Service"
                label="I agree"
              /> */}
              <FormikButton
                variant="contained"
                color="primary"
                sx={{ marginBottom: "12px" }}
              >
                Submit Form
              </FormikButton>
            </Form>
          </Formik>
        </div>
      </Box>
    </Box>
  );
}
