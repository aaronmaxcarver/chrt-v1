import { useFormikContext } from "formik";

import LoadingButton from "@mui/lab/LoadingButton";

export default function FormikFinancialDataButton({ children, ...otherProps }) {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configButton = {
    ...otherProps,
    // fullWidth: true,
    onClick: handleSubmit,
  };

  return <LoadingButton {...configButton}>{children}</LoadingButton>;
}
