# :file_folder: chrt-v1 :bar_chart: 

- This repo has excerpts from chrt-v1, a retired React SPA (Single-Page Application) that was used at [chrt.com](https://chrt.com)
- An updated version, chrt-v2 ([chrt-vite](https://github.com/chrtHub/chrt-vite)), is live at [chrt.com](https://chrt.com)

### Auth notes

- SRP + MFA sign in for AWS Cognito Identity Pool & User Pools, integrates use of both JWT tokens and AWS Temporary Credentials that use SigV4 to directly access AWS services
- Sessions management via DynamoDB table, sessions are also trackable and revocable by users

### Financial Data notes

- Pricing and indicators charts<br/>
![charts](https://s3.amazonaws.com/chrt.com/charts.png)

- Theme menus<br/>
![theme menus](https://s3.amazonaws.com/chrt.com/customize.png)

- Fully customizable and charts with serializable and shareable themes<br/>
![custom charts](https://s3.amazonaws.com/chrt.com/custom_charts.png)

### Formik notes

- Autocomplete with data for 8,000+ equities<br/>
![autocomplete](https://s3.amazonaws.com/chrt.com/autocomplete.png)

### SDK Clients notes

- Integrates Cognito User Pools and Identity pools to provide users with access to any AWS service backed by an SDK

### Settings notes

- Just some settings pages :)
