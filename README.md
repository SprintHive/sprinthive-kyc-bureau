# SprintHive KYC bureau

The purpose of this project is to provide bearu data for the kyc service.

The basic idea is that this project will listen to a rabbit message queue 
for jobs.  
When a job arrives it will lookup customer data by making an http call to a bureau and return the result by
publishing a message on a rabbit message queue.

## Config 

You can configure the services for your local environment but creating a .env file in the project root.  
You can copy the the ```.env-sample``` and edit it, like so.

    cp .env-sample .env

This service connects to a rabbit message queue and makes calls to a bureau service.  
To get a copy of the bureau service go to [https://github.com/SprintHive/sprinthive-bureau]() and follow the read me.

## Getting up and running

    # get the code
    git clone git@github.com:SprintHive/sprinthive-kyc-bureau.git
    
    # change into the project directory     
    cd sprinthive-kyc-bureau
    
    # download dependencies 
    yarn install
    
    # start the server
    yarn server 

### Testing

Here is an example of the message payload you can use to kick the process off.  
Publish this message onto the ```individual-profile-request``` exchange with the routing key ```attempt-0```.

    {
      "identifyingNumber": "1234567890123", 
      "individualVerificationId": "some-uuid-xxx-123", 
      "lastName": "Little"
     }      
