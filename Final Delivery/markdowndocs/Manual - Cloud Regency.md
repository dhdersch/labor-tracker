Labor Tracker Manual
===

## Introduction
:tada: Welcome to the _Labor Tracker_ :baby:! The application's main function is to track cervical dilation during labor. This manual will guide you in using the _Labor Tracker_ to ultimately create partograms for patients undergoing labor.  You can navigate this document by clicking the <i class="fa fa-bars"></i> button on the bottom right to reveal the _Table of Contents_.


## Sign in
> Sign in Screen
![sign in screen](https://i.imgur.com/54DflRl.png)

To sign into the labor tracker, a patient must first sign into the application by using a Google account. At this time, the _Labor Tracker_ only supports Google accounts. 

By clicking the `Sign In` button, a pop-up window will appear on your screen from Google that will allow you to either choose a Google account that has previously been used, or to use another account.

> Choose an Account Screen
![choose an account](https://i.imgur.com/oubZTtr.png)

Once a patient has signed in, they will automatically be placed in the patient screen.

## Patient Screen
The patient screen's main purpose is to gather information about the patient that will become curcial when generating the partogram. There are 3 sections on the patient screen and they have been outlined in the screenshot below. 

![](https://i.imgur.com/68jq7sE.png)

### Section 1: Patient Information: 
A patient may enter these values: 
1. Initials - Are used to loosely identify the patient
2. Age 
3. Number of Vaginal Births 
4. Room number
5. Height - must be given in inches (in)
6. Weight - must be given in pounds (lbs)

### Section 2: Provider Link
The provider link displays a URL that can be given to a patient's provider and that provider will have access to the patient's partogram. This link is specifically given to the patient so that the patient may have control over who views their partogram.

### Section 3: Save
By clicking the `Save` button, the data will be saved to the patient's profile. 

## View Partograms Screen
The view partograms screen is table view of all of the Partograms a particular user has access to view. The partograms that will be shown here will be both the user's own partograms, and if the user is a provider, any other partograms the provider has been given access to. There are 2 sections on the view partograms screen and they have been outlined in the screenshot below.
![View Partograms Screen](https://i.imgur.com/vyBUL2y.png)

### Section 1: Partogram Information and Actions: 
In this section, partograms are neatly layed out in a table format. 

Information Provided:
1. Patient Initials
2. Room Number
3. Time - The time the partogram was created

Actions Available: 
1. View - View the partogram. Clicking this button will display the partogram for that patient.
2. Delete - Delete the partogram. **(Once deleted, the partogram is unrecoverable)**

### Section 2: Make New Partogram
It's simple to create a brand new partogram. From the view partograms screen, click the `make new partogram` button.

This will open up a modal so that you can enter the time at which a patient has begun labor. This is a crucial metric as the partogram will not display helpful warnings and "red zones" correctly. 

> Add Partogram Modal
![Add Partogram Modal](https://i.imgur.com/5gROfDa.png)

Once a partogram has been created, the View Partograms screen will display a new row for the newly created partogram.

## Viewing a Partogram
The most important part of the _Labor Tracker_ is of course the partogram view. By clicking the `View` button on the View Partograms screen, this will open up the full detailed view that is displayed in the screenshot below. There are 3 sections on the screen and they have been outlined in the screenshot below.
![](https://i.imgur.com/nlR3PIL.png)

### Section 1: Partogram Measurements
The dilation measurement and time of observation are recorded here. These measurements line up to the partogram graph that is directly to the right of it. Adding measurements is as simple as clicking the `Add measurement` button and inputting the time of observation and the dilation measurement in cm. 
### Section 2: Partogram
The partogram is the central focus of this page. This area will be blank until there are 2 measuremets added to the left side measurement's table. Once 2 measurements have been inputted, the partogram will generate along with "red zone" areas. The partogram has black dots indicating the dilation measurement and observation time. 

A user may easily download a .png file of the partogram by clicking the `Download Partogram` button.

### Section 3: Patient Details
This section is a small informational purpose section that tells general details about the patient. An important value that is generated alongside the partogram is the 'status' value. This value is dynamic based on the measurements taken throughout labor.

## Trusted Providers Screen

![](https://i.imgur.com/vHSAyQU.png)
The trusted providers screen provides one function. A patient may input a Provider ID and allow that Provider to log into the _Labor Tracker_ and view their partogram. Any providers that have been added will show here as well as displayed by the screenshot below.

![](https://i.imgur.com/U3BsiiH.png)

