import { useField, useFormikContext } from "formik";

import { tickers as TICKERS_LIST } from "./allTickersList";

import { TextField } from "@mui/material";
import { Autocomplete } from "@mui/material";

export default function FormikFinancialDataAutocomplete({
  name,
  ...otherProps
}) {
  const [field, meta, helpers] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  const { submitForm } = useFormikContext();
  const { setValue } = helpers;

  return (
    <Autocomplete
      id="tickerReportList"
      options={TICKERS_LIST}
      disableListWrap
      size="small"
      // fullWidth={true}
      renderInput={(params) => (
        <TextField
          {...configTextfield}
          {...params}
          //----//
        />
      )}
      onChange={(_event, value) => {
        setValue(value);
        submitForm();
      }}
    />
  );
}

//-- Steps taken in binding Autocomplete changes to field value: --//
//-- (0) Read the documentation page for useField --//
//-- (1) Realize that there's a setValue function which can be destructured from helpers and used to set the value imperatively --//

//-- Two ways the value of dataEntity can change: --//
//-- (1) via the built-in field.onChange prop which gets spread into the configTextField and passed to the <TextField /> component --//
//-- (2) via the setValue function destructured from helpers and passed to the <Autcomplete /> component --//
