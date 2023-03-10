# :bar_chart: chrt-v1

- This repo has excerpts from chrt-v1, a retired React SPA that was written by me ([aaronmaxcarver](https://github.com/aaronmaxcarver)) and used at [chrt.com](https://chrt.com)
- An updated version, chrt-v2 ([chrt-vite](https://github.com/chrtHub/chrt-vite)), is live at [chrt.com](https://chrt.com)

### (1) Auth notes

- SRP + MFA sign in for AWS Cognito Identity Pool & User Pools, integrates use of both JWT tokens and AWS Temporary Credentials that use SigV4 to directly access AWS services
- Sessions management via DynamoDB table, sessions are also trackable and revocable by users

### (2) Financial Data notes

- Multiple synchronized and resizable pricing and indicators charts<br/>
![charts](https://s3.amazonaws.com/chrt.com/charts.png)

- Theme menus<br/>
![theme menus](https://s3.amazonaws.com/chrt.com/customize.png)

- Fully customizable and charts with serializable and shareable themes<br/>
![custom charts](https://s3.amazonaws.com/chrt.com/custom_charts.png)

### (3) Formik notes

- Autocomplete with data for 8,000+ equities<br/>
![autocomplete](https://s3.amazonaws.com/chrt.com/autocomplete.png)

### (4) SDK Clients notes

- Integrates Cognito User Pools and Identity pools to provide users with access to any AWS service backed by an SDK

### (5) Settings notes

- Just some settings pages :)
