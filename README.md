# 0. Affordable Serverless

1. What is serverless?
2. [Monolith cost](https://azure.microsoft.com/pricing/calculator?WT.mc_id=startup-0000-chnwamba)
3. [Serverless cost](https://azure.microsoft.com/pricing/calculator?WT.mc_id=startup-0000-chnwamba) and [serverless cost breakdown](https://dev.to/azure/is-serverless-really-as-cheap-as-everyone-claims-4i9n)



# 1. Setup

## 1.1 Create Azure Account


1. Create [Azure account](https://azure.microsoft.com/free/?WT.mc_id=startup-0000-chnwamba)

1. Create account with Azure Passes
    1. Go to [Azure Pass page](https://www.microsoftazurepass.com)
    2. Read [how to redeem](https://www.microsoftazurepass.com/Home/HowTo) the Azure pass
    3. Enter the Pass you have been issued


2. [Install CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest&WT.mc_id=startup-0000-chnwamba)


3. Login in from CLI

```bash
az login
```

## 1.2 Setup Azure Functions



1. Install Function CLU tool

```bash
npm i -g azure-functions-core-tools@2 --unsafe-perm true
```

![](https://paper-attachments.dropbox.com/s_104E0798B4FDC59E21041EFAF6FA26FA72CB430A3A215414C281E2904DB3D568_1582102852713_image.png)

2. Confirm installation

```bash
func -v
```

![](https://paper-attachments.dropbox.com/s_104E0798B4FDC59E21041EFAF6FA26FA72CB430A3A215414C281E2904DB3D568_1582102929423_image.png)


## 1.3 Create Your First Function

1. Initialiaze a project


```bash
# In existing folder
func init .

# In a new folder
func init <folder-name>
```

![](https://paper-attachments.dropbox.com/s_104E0798B4FDC59E21041EFAF6FA26FA72CB430A3A215414C281E2904DB3D568_1582102979106_image.png)



2. Generated files

```bash
.
├── host.json
├── local.settings.json
└── package.json
```

- `host.json`: Stores configuration files for your project. Can be committed to source control

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[1.*, 2.0.0)"
  }
}
```

- `local.settings.json`: Your local copy of your environmental variable. D

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "{AzureWebJobsStorage}"
  }
}
```

- `package.json` is node’s package manager and this is where you specify and manage your serverless dependencies:

```json
{
  "name": "",
  "version": "",
  "description": "",
  "scripts" : {
    "test": "echo \"No tests yet...\""
  },
  "author": ""
}
```

3. Create a function


    func new --name helloWorld --template "HttpTrigger"

Files:

```bash
.
├── helloWorld
│   ├── function.json
│   └── index.js
├── host.json
├── local.settings.json
└── package.json
```


- `helloWorld/function.json`: Configuration for a specific function. The only configuration here is the `bindings` config which tells Azure Functions what the input source and output of this function is. You can see in is a HTTP request and out is a response.

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```


- `helloWorld/index.js`: Function content

```js
module.exports = async function(context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: 'Hello ' + (req.query.name || req.body.name)
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    };
  }
};
``` 


4. Start function

```bash
func start
```

![](https://paper-attachments.dropbox.com/s_D5062854EF4C126A0313F2EA1FD8A5ADB2C00E6F381903C2B2490D90B336456A_1582104636377_image.png)


At the end:


![](https://paper-attachments.dropbox.com/s_D5062854EF4C126A0313F2EA1FD8A5ADB2C00E6F381903C2B2490D90B336456A_1582104661752_image.png)


## 1.4 Deploy to Azure

1. Create resource group

```bash
az group create \
  --name <group name> \
  --location uksouth
```

2. Create a General Purpose (GP) storage account for code storage and function state:

```bash
az storage account create \
  --name <storage name> \
  --location uksouth \
  --resource-group <group name> \
  --sku Standard_LRS
```

3. Create a function

```bash
az functionapp create \
  --resource-group <group name> \
  --consumption-plan-location uksouth \
  --name <function name> \
  --storage-account <storage name> \
  --runtime node
```

4. Push local to prod

```bash
func azure functionapp publish <prod func name>
```

![](https://paper-attachments.dropbox.com/s_2393897B2FD59C6E48655C7F719DAAF8C1A08ECA06D28ACEBC77CEE042C40676_1582106548473_image.png)


## 1.5 Resources

- [Create your first function from the command line using Azure CLI](https://docs.microsoft.com/azure/azure-functions/functions-create-first-azure-function-azure-cli?WT.mc_id=startup-0000-chnwamba)
- [Function CLI Commands](https://docs.microsoft.com/azure/azure-functions/functions-run-local?WT.mc_id=startup-0000-chnwamba)
- [Monolith vs Microservices](https://articles.microservices.com/monolithic-vs-microservices-architecture-5c4848858f59?gi=29dd1f7f7244)
- [Is Serverless really as cheap as everyone claims?](https://dev.to/azure/is-serverless-really-as-cheap-as-everyone-claims-4i9n)





# 2. Event Driven: Triggers and Binding


- What we saw in chapter 1 uses a HTTP trigger.
- Functions are event driven and must be executed by a trigger just like the HTTP trigger
- You can also channel the output of a function to another service. This channeling is called binding.

## 2.1 Create a Timer Triggered Function


1. Create a function project

```bash
func new .
```

2. Create a timer function:

```bash
func new --name scheduler --template="Timer Trigger"
```

Files:

```bash    
.
├── host.json
├── local.settings.json
├── package.json
└── scheduler
    ├── function.json
    ├── index.js
    └── readme.md
```

`scheduler/function.json`:

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */5 * * * *"
    }
  ]
}
```

Update it to run every 30 seconds:

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0/30 * * * * *"
    }
  ]
}
```

`scheduler/index.js`

```js
module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.IsPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};
```

3. Test the function

```bash
func start
```

Give it 30 seconds to start logging the messages:


![](https://paper-attachments.dropbox.com/s_80DB5EE69AB0792700F01A949FABB8805A988BDB8294674FAFBACB201E38F73F_1582110213259_image.png)


## 2.2 Setup Send Grid

1. Go to SendGrid
2. Sign up or login
3. Verify your email (No background check required)
4. Expand the Settings dropdown
5. Click on API Keys → https://app.sendgrid.com/settings/api_keys
6. Click Create API Key if you don’t have one
7. Copy key

## 2.3 Send Email with Binding

1. Update `local.settings.json` with Send Grid API Key:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "{AzureWebJobsStorage}",
    "MySendGridKey": "<API Key>"
  }
}
```

2. Update `scheduler/function.json` to add a new binding for send grid:

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0/30 * * * * *"
    },
    {
      "name": "$return",
      "type": "sendGrid",
      "direction": "out",
      "apiKey" : "MySendGridKey",
  }
  ]
}
```

The send grid binding listens to output through the functions return. It will send an email based using the return value as the email payload


3. Update function code at `scheduler/index.js` to send an email every time the timer runs:

```js
module.exports = async function(context, myTimer) {
  var timeStamp = new Date().toISOString();
  if (myTimer.IsPastDue) {
    context.log('JavaScript is running late!');
  }
  const msg = `JavaScript timer trigger function ran! at ${timeStamp}`;

  const email = {
    personalizations: [{ to: [{ email: '<TO EMAIL>' }] }],
    from: { email: '<FROM EMAIL>' },
    subject: 'Affordable Cloud News',
    content: [
      {
        type: 'text/plain',
        value: msg
      }
    ]
  };
  context.log(msg);

  return email;
};
```

Update `<FROM EMAIL>` and `<TO EMAIL>` with your credentials.


4. Start function:

```bash
func start
```

## 2.4 Resources

- [Function Timer Trigger](https://docs.microsoft.com/azure/azure-functions/functions-bindings-timer?WT.mc_id=startup-0000-chnwamba)
- [Function NCRON](https://docs.microsoft.com/azure/azure-functions/functions-bindings-timer?WT.mc_id=startup-0000-chnwamba)
- [Function Twilio Binding](https://docs.microsoft.com/azure/azure-functions/functions-bindings-twilio?WT.mc_id=startup-0000-chnwamba)
- [Function SendGrid Binding](https://docs.microsoft.com/azure/azure-functions/functions-bindings-sendgrid?WT.mc_id=startup-0000-chnwamba)


# 3. Stateful Serverless

1. First install [VS Code](https://code.visualstudio.com/?WT.mc_id=startup-0000-chnwamba)
2. Then install Azure Functions VS Code extension

[How to (Dev.to)](https://dev.to/azure/stateful-serverless-with-durable-functions-2jff)


# 4. CRUD with Serverless

[How to (Scotch.io)](https://scotch.io/tutorials/crud-with-azure-serverless-functions)
