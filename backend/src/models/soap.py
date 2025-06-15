from datetime import date
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class SOAPNoteRequest(BaseModel):
    summary: str = Field(
        ..., description="The clinical summary to extract the SOAP note from."
    )


class VitalSigns(BaseModel):
    blood_pressure_systolic: Optional[int] = Field(
        None, description="Systolic BP in mmHg"
    )
    blood_pressure_diastolic: Optional[int] = Field(
        None, description="Diastolic BP in mmHg"
    )
    heart_rate: Optional[int] = Field(None, description="Heart rate in bpm")
    respiratory_rate: Optional[int] = Field(
        None, description="Respiratory rate per minute"
    )
    temperature: Optional[float] = Field(None, description="Temperature in Fahrenheit")
    oxygen_saturation: Optional[int] = Field(None, description="SpO2 percentage")
    oxygen_saturation_on_room_air: Optional[bool] = Field(
        None, description="Whether O2 sat is on room air"
    )
    weight_kg: Optional[float] = Field(None, description="Weight in kilograms")
    bmi: Optional[float] = Field(None, description="Body Mass Index")
    weight_change: Optional[str] = Field(
        None, description="Weight change from previous visit"
    )


class Medication(BaseModel):
    name: str = Field(..., description="Medication name")
    dosage: str = Field(..., description="Dosage amount")
    frequency: str = Field(..., description="Frequency (e.g., BID, daily, TID)")
    route: Optional[str] = Field(None, description="Route of administration")


class SocialHistory(BaseModel):
    living_situation: Optional[str] = Field(None, description="Who patient lives with")
    occupation: Optional[str] = Field(None, description="Current or former occupation")
    employment_status: Optional[str] = Field(None, description="Working, retired, etc.")
    transportation_barriers: Optional[bool] = Field(
        None, description="Has transportation difficulties"
    )
    food_insecurity: Optional[bool] = Field(
        None, description="Experiences food insecurity"
    )
    financial_strain: Optional[bool] = Field(
        None, description="Has financial difficulties"
    )
    housing_stability: Optional[str] = Field(None, description="Housing situation")


class PhysicalExam(BaseModel):
    general_appearance: Optional[str] = Field(None, description="General appearance")
    cardiovascular: Optional[str] = Field(
        None, description="Cardiovascular exam findings"
    )
    respiratory: Optional[str] = Field(None, description="Respiratory exam findings")
    extremities: Optional[str] = Field(None, description="Extremity exam findings")
    neurological: Optional[str] = Field(None, description="Neurological exam findings")
    skin: Optional[str] = Field(None, description="Skin exam findings")
    musculoskeletal: Optional[str] = Field(None, description="Musculoskeletal findings")
    other_findings: Optional[str] = Field(
        None, description="Other examination findings"
    )


class Diagnosis(BaseModel):
    condition: str = Field(..., description="Diagnosis or condition name")
    icd10_code: Optional[str] = Field(None, description="ICD-10 diagnosis code")
    status: Optional[str] = Field(None, description="Active, stable, worsening, etc.")
    severity: Optional[str] = Field(None, description="Mild, moderate, severe")


class Medication_Plan(BaseModel):
    medication: str = Field(..., description="Medication name")
    action: str = Field(
        ..., description="start, increase, decrease, discontinue, continue"
    )
    dosage: str = Field(..., description="New or current dosage")
    frequency: str = Field(..., description="Dosing frequency")
    indication: Optional[str] = Field(None, description="What condition this treats")


class Order(BaseModel):
    type: str = Field(..., description="lab, imaging, procedure, etc.")
    description: str = Field(..., description="Specific test or procedure ordered")
    indication: Optional[str] = Field(None, description="Clinical reason for order")
    timing: Optional[str] = Field(None, description="When to complete")


class Referral(BaseModel):
    specialty: str = Field(..., description="Type of specialist or service")
    reason: str = Field(..., description="Reason for referral")
    urgency: Optional[str] = Field(None, description="Routine, urgent, stat")


class CareCoordination(BaseModel):
    care_manager_involved: Optional[bool] = Field(
        None, description="Care manager participated"
    )
    care_manager_name: Optional[str] = Field(None, description="Name of care manager")
    services_coordinated: Optional[List[str]] = Field(
        None, description="Services arranged"
    )
    home_health_ordered: Optional[bool] = Field(
        None, description="Home health services ordered"
    )
    social_services_referral: Optional[bool] = Field(
        None, description="Social services involved"
    )


class FollowUp(BaseModel):
    timing: str = Field(
        ..., description="When to follow up (e.g., '2 weeks', '1 month')"
    )
    location: Optional[str] = Field(None, description="Clinic, telehealth, etc.")
    purpose: Optional[str] = Field(None, description="Reason for follow-up visit")


class BillingInfo(BaseModel):
    cpt_code: str = Field(..., description="CPT code for visit")
    visit_complexity: Optional[str] = Field(
        None, description="Low, moderate, high complexity"
    )
    icd10_codes: List[str] = Field(..., description="All ICD-10 codes for billing")


class Subjective(BaseModel):
    patient_name: Optional[str] = Field(None, description="Patient name")
    age: Optional[int] = Field(None, description="Patient age")
    gender: Optional[str] = Field(None, description="Patient gender")
    ethnicity: Optional[str] = Field(None, description="Patient ethnicity")
    chief_complaint: str = Field(..., description="Primary reason for visit")
    history_present_illness: str = Field(..., description="Detailed HPI narrative")
    medical_history: List[str] = Field(
        default_factory=list, description="Past medical history"
    )
    surgical_history: Optional[List[str]] = Field(
        None, description="Past surgical history"
    )
    family_history: Optional[str] = Field(None, description="Relevant family history")
    social_history: Optional[SocialHistory] = Field(
        None, description="Social history details"
    )
    current_medications: List[Medication] = Field(
        default_factory=list, description="Current medications"
    )
    allergies: Optional[List[str]] = Field(None, description="Known allergies")
    review_of_systems: Optional[str] = Field(
        None, description="Additional symptoms mentioned"
    )


class Objective(BaseModel):
    vital_signs: Optional[VitalSigns] = Field(
        None, description="Vital sign measurements"
    )
    physical_exam: Optional[PhysicalExam] = Field(
        None, description="Physical examination findings"
    )
    diagnostic_results: Optional[Dict[str, str]] = Field(
        None, description="Lab or test results mentioned"
    )


class Assessment(BaseModel):
    primary_diagnoses: List[Diagnosis] = Field(
        ..., description="Primary diagnoses in order of priority"
    )
    secondary_diagnoses: Optional[List[Diagnosis]] = Field(
        None, description="Secondary/chronic diagnoses"
    )
    social_determinants: Optional[List[str]] = Field(
        None, description="Social factors affecting health"
    )
    clinical_impression: Optional[str] = Field(
        None, description="Overall clinical assessment"
    )


class Plan(BaseModel):
    medications: Optional[List[Medication_Plan]] = Field(
        None, description="Medication changes"
    )
    orders: Optional[List[Order]] = Field(None, description="Diagnostic orders")
    referrals: Optional[List[Referral]] = Field(
        None, description="Specialist referrals"
    )
    care_coordination: Optional[CareCoordination] = Field(
        None, description="Care team coordination"
    )
    patient_education: Optional[List[str]] = Field(
        None, description="Education provided"
    )
    follow_up: Optional[FollowUp] = Field(None, description="Follow-up plans")
    preventive_care: Optional[List[str]] = Field(
        None, description="Vaccines, screenings provided"
    )


class SOAPNote(BaseModel):
    """
    Complete SOAP note structure for clinical documentation
    """

    visit_date: Optional[date] = Field(None, description="Date of visit")
    subjective: Subjective = Field(..., description="Subjective section")
    objective: Objective = Field(..., description="Objective section")
    assessment: Assessment = Field(..., description="Assessment section")
    plan: Plan = Field(..., description="Plan section")
    billing_info: Optional[BillingInfo] = Field(None, description="Billing information")
