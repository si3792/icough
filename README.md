# icough
Web application for doctors and patients, built on top of drf-angular-user-system.


## API

### /icough/appointments/

API endpoint for Appointments

**GET** returns a list of UPCOMING appointments where:  
- If request comes from a patient, appointments where patient = user are returned.  
- If request comes from a doctor, appointments where doctor = user are returned.  

**POST** expects a a `time` field as well as `doctor` object field.  
( Doctor objects are retrieved from `/icough/doctors/` )

**PUT** is used to update appointment at `/icough/appointments/id/`  where:  
- If request comes from a doctor, `state` field is expected.  
- If request comes from a patient, `time` field is expected.

### /icough/history/

API endpoint for Appointments history

**GET** returns a list of EXPIRED appointments where:  
- If request comes from a patient, appointments where patient = user are returned.  
- If request comes from a doctor, appointments where doctor = user are returned.


### /icough/doctors/

Endpoint for fetching a list of doctors.  

**GET** returns an array of doctor objects.
