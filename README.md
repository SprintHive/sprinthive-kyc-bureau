# SprintHive KYC bureau

The purpose of this project is to provide bearu data for the kyc service.

The basic idea is that this project will listen to a rabbit message queue 
for jobs.  
When a job arrives it will lookup customer data and return the result by
publishing a message on a rabbit message queue.

