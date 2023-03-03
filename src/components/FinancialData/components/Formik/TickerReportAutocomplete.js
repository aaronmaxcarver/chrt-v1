import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import FormikFinancialDataAutocomplete from "./FormikFinancialDataAutocomplete";
import FormikFinancialDataButton from "./FormikFinancialDataButton";

import Box from "@mui/material/Box";

const LAYOUT_SX = {
  display: "grid",
  height: "100%",
  width: "100%",
  gridTemplateRows: `auto`,
  gridTemplateColumns: `auto auto`,
  gridTemplateAreas: `"left right"`,
  gap: "6px",
};

const LEFT_SX = {
  gridArea: "left",
  minWidth: "140px", // DEV
};

const RIGHT_SX = {
  gridArea: "right",
};

const INITIAL_FORM_STATE = {
  dataEntity: "",
};

const FORM_VALIDATION = Yup.object().shape({
  //-- "" prevents error state theming of TextField, not sure about error state for submission purposes... --//
  dataEntity: Yup.string().required("").nullable(),
});

export default function TickerReportAutocomplete(props) {
  let navigate = useNavigate();

  return (
    <Fragment>
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => {
          navigate(`/data/${values.dataEntity?.toUpperCase()}`);
        }}
      >
        <Form>
          <Box sx={LAYOUT_SX}>
            <FormikFinancialDataAutocomplete
              name="dataEntity"
              label="Ticker"
              sx={LEFT_SX}
            />
            <FormikFinancialDataButton
              variant="contained"
              size="small"
              sx={RIGHT_SX}
              loading={props.isLoading}
              loadingIndicator="SUBMIT"
            >
              SUBMIT
            </FormikFinancialDataButton>
          </Box>
        </Form>
      </Formik>
    </Fragment>
  );
}
