from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import date


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

    def to_html(self) -> str:
        """Render the SOAPNote as a detailed, human-readable HTML summary."""

        def highlight_null(val):
            if val is None or (isinstance(val, str) and not val.strip()):
                return "<span style='color:red;font-weight:bold'>[MISSING]</span>"
            return val

        subj = self.subjective
        obj = self.objective
        assess = self.assessment
        plan = self.plan
        billing = self.billing_info

        # Demographics
        demographics = [
            f"<b>Name:</b> {highlight_null(getattr(subj, 'patient_name', None))}",
            f"<b>Age:</b> {highlight_null(getattr(subj, 'age', None))}",
            f"<b>Gender:</b> {highlight_null(getattr(subj, 'gender', None))}",
            f"<b>Ethnicity:</b> {highlight_null(getattr(subj, 'ethnicity', None))}",
        ]
        demographics_html = "<br>".join(demographics)

        # Medical History
        med_hist = (
            "<ul>"
            + "".join(f"<li>{item}</li>" for item in subj.medical_history)
            + "</ul>"
            if subj.medical_history
            else highlight_null(None)
        )
        surg_hist = (
            "<ul>"
            + "".join(f"<li>{item}</li>" for item in (subj.surgical_history or []))
            + "</ul>"
            if subj.surgical_history
            else highlight_null(None)
        )
        fam_hist = highlight_null(getattr(subj, "family_history", None))

        # Social History
        soc = subj.social_history
        soc_hist = []
        if soc:
            soc_hist.append(f"Living situation: {highlight_null(soc.living_situation)}")
            soc_hist.append(f"Occupation: {highlight_null(soc.occupation)}")
            soc_hist.append(
                f"Employment status: {highlight_null(soc.employment_status)}"
            )
            if soc.transportation_barriers:
                soc_hist.append("Transportation barriers")
            if soc.food_insecurity:
                soc_hist.append("Food insecurity")
            if soc.financial_strain:
                soc_hist.append("Financial strain")
            soc_hist.append(
                f"Housing stability: {highlight_null(soc.housing_stability)}"
            )
        social_history = (
            "<ul>" + "".join(f"<li>{item}</li>" for item in soc_hist) + "</ul>"
            if soc_hist
            else highlight_null(None)
        )

        # Medications
        meds = (
            "<ul>"
            + "".join(
                f"<li>{m.name} ({m.dosage}, {m.frequency}, {m.route})</li>"
                for m in subj.current_medications
            )
            + "</ul>"
            if subj.current_medications
            else highlight_null(None)
        )

        allergies = (
            "<ul>"
            + "".join(f"<li>{item}</li>" for item in (subj.allergies or []))
            + "</ul>"
            if subj.allergies
            else highlight_null(None)
        )

        ros = highlight_null(getattr(subj, "review_of_systems", None))

        # Vital Signs
        vs = obj.vital_signs
        vitals = []
        if vs:
            if (
                vs.blood_pressure_systolic is not None
                and vs.blood_pressure_diastolic is not None
            ):
                vitals.append(
                    f"Blood Pressure: {vs.blood_pressure_systolic}/{vs.blood_pressure_diastolic} mmHg"
                )
            if vs.heart_rate is not None:
                vitals.append(f"Heart Rate: {vs.heart_rate} bpm")
            if vs.respiratory_rate is not None:
                vitals.append(f"Respiratory Rate: {vs.respiratory_rate}/min")
            if vs.temperature is not None:
                vitals.append(f"Temperature: {vs.temperature} °F")
            if vs.oxygen_saturation is not None:
                vitals.append(f"SpO₂: {vs.oxygen_saturation}%")
            if vs.oxygen_saturation_on_room_air is not None:
                vitals.append(f"O₂ on room air: {vs.oxygen_saturation_on_room_air}")
            if vs.weight_kg is not None:
                vitals.append(f"Weight: {vs.weight_kg} kg")
            if vs.bmi is not None:
                vitals.append(f"BMI: {vs.bmi}")
            if vs.weight_change:
                vitals.append(f"Weight Change: {vs.weight_change}")
        vital_signs = (
            "<ul>" + "".join(f"<li>{item}</li>" for item in vitals) + "</ul>"
            if vitals
            else highlight_null(None)
        )

        # Physical Exam
        pe = obj.physical_exam
        pe_lines = []
        if pe:
            if pe.general_appearance:
                pe_lines.append(f"General: {pe.general_appearance}")
            if pe.cardiovascular:
                pe_lines.append(f"Cardiovascular: {pe.cardiovascular}")
            if pe.respiratory:
                pe_lines.append(f"Respiratory: {pe.respiratory}")
            if pe.extremities:
                pe_lines.append(f"Extremities: {pe.extremities}")
            if pe.neurological:
                pe_lines.append(f"Neurological: {pe.neurological}")
            if pe.skin:
                pe_lines.append(f"Skin: {pe.skin}")
            if pe.musculoskeletal:
                pe_lines.append(f"Musculoskeletal: {pe.musculoskeletal}")
            if pe.other_findings:
                pe_lines.append(f"Other: {pe.other_findings}")
        physical_exam = (
            "<ul>" + "".join(f"<li>{item}</li>" for item in pe_lines) + "</ul>"
            if pe_lines
            else highlight_null(None)
        )

        # Diagnostic Tests
        diag_tests = (
            "<ul>"
            + "".join(
                f"<li>{k}: {v}</li>" for k, v in (obj.diagnostic_results or {}).items()
            )
            + "</ul>"
            if obj.diagnostic_results
            else highlight_null(None)
        )

        # Assessment
        primary_dx = (
            "<ul>"
            + "".join(
                f"<li>{d.condition} (ICD-10: {d.icd10_code}, Status: {d.status}, Severity: {d.severity})</li>"
                for d in assess.primary_diagnoses
            )
            + "</ul>"
            if assess.primary_diagnoses
            else highlight_null(None)
        )
        secondary_dx = (
            "<ul>"
            + "".join(
                f"<li>{d.condition} (ICD-10: {d.icd10_code}, Status: {d.status}, Severity: {d.severity})</li>"
                for d in (assess.secondary_diagnoses or [])
            )
            + "</ul>"
            if assess.secondary_diagnoses
            else highlight_null(None)
        )
        sdh = (
            "<ul>"
            + "".join(f"<li>{item}</li>" for item in (assess.social_determinants or []))
            + "</ul>"
            if assess.social_determinants
            else highlight_null(None)
        )
        psychosocial = highlight_null(getattr(assess, "clinical_impression", None))

        # Plan
        med_plan = (
            "<ul>"
            + "".join(
                f"<li>{m.action.capitalize()} {m.medication} ({m.dosage}, {m.frequency}, Indication: {m.indication})</li>"
                for m in (plan.medications or [])
            )
            + "</ul>"
            if plan.medications
            else highlight_null(None)
        )
        orders = (
            "<ul>"
            + "".join(
                f"<li>{o.type.capitalize()}: {o.description} (Indication: {o.indication}, Timing: {o.timing})</li>"
                for o in (plan.orders or [])
            )
            + "</ul>"
            if plan.orders
            else highlight_null(None)
        )
        referrals = (
            "<ul>"
            + "".join(
                f"<li>{r.specialty}: {r.reason} (Urgency: {r.urgency})</li>"
                for r in (plan.referrals or [])
            )
            + "</ul>"
            if plan.referrals
            else highlight_null(None)
        )
        care_coord = ""
        if plan.care_coordination and plan.care_coordination.care_manager_involved:
            cm = plan.care_coordination
            services = (
                ", ".join(cm.services_coordinated) if cm.services_coordinated else ""
            )
            care_coord = (
                f"Care manager involved: {highlight_null(cm.care_manager_name)}<br>"
                f"Services coordinated: {services if services else highlight_null(None)}<br>"
                f"Home health ordered: {highlight_null(cm.home_health_ordered)}<br>"
                f"Social services referral: {highlight_null(cm.social_services_referral)}"
            )
        else:
            care_coord = highlight_null(None)
        pt_ed = (
            "<ul>"
            + "".join(f"<li>{item}</li>" for item in (plan.patient_education or []))
            + "</ul>"
            if plan.patient_education
            else highlight_null(None)
        )
        followup = (
            f"{plan.follow_up.timing}, {plan.follow_up.location}, {plan.follow_up.purpose}"
            if plan.follow_up
            else highlight_null(None)
        )
        preventive = (
            "<ul>"
            + "".join(f"<li>{item}</li>" for item in (plan.preventive_care or []))
            + "</ul>"
            if plan.preventive_care
            else highlight_null(None)
        )

        # Billing
        cpt = (
            highlight_null(getattr(billing, "cpt_code", None))
            if billing
            else highlight_null(None)
        )
        complexity = (
            highlight_null(getattr(billing, "visit_complexity", None))
            if billing
            else highlight_null(None)
        )
        icd10 = (
            "<ul>"
            + "".join(
                f"<li>{code}</li>"
                for code in (
                    billing.icd10_codes if billing and billing.icd10_codes else []
                )
            )
            + "</ul>"
            if billing and billing.icd10_codes
            else highlight_null(None)
        )

        return f"""
            <h2>SOAP Note</h2>
            <b>Date of Visit:</b> {highlight_null(getattr(self, "visit_date", None))}<br>
            <details>
              <summary><b>SUBJECTIVE</b></summary>
              <div>
                {demographics_html}<br>
                <b>Chief Complaint:</b> {highlight_null(getattr(subj, "chief_complaint", None))}<br>
                <b>History of Present Illness:</b> {highlight_null(getattr(subj, "history_present_illness", None))}<br>
                <b>Medical History:</b> {med_hist}
                <b>Surgical History:</b> {surg_hist}
                <b>Family History:</b> {fam_hist}<br>
                <b>Social History:</b> {social_history}
                <b>Current Medications:</b> {meds}
                <b>Allergies:</b> {allergies}
                <b>Review of Systems:</b> {ros}<br>
              </div>
            </details>
            <details>
              <summary><b>OBJECTIVE</b></summary>
              <div>
                <b>Vital Signs:</b> {vital_signs}
                <b>Physical Examination:</b> {physical_exam}
                <b>Diagnostic Tests:</b> {diag_tests}
              </div>
            </details>
            <details>
              <summary><b>ASSESSMENT</b></summary>
              <div>
                <b>Primary Diagnoses:</b> {primary_dx}
                <b>Secondary Diagnoses:</b> {secondary_dx}
                <b>Social Determinants of Health:</b> {sdh}
                <b>Psychosocial Factors:</b> {psychosocial}<br>
              </div>
            </details>
            <details>
              <summary><b>PLAN</b></summary>
              <div>
                <b>Medications:</b> {med_plan}
                <b>Diagnostic Orders:</b> {orders}
                <b>Referrals:</b> {referrals}
                <b>Care Coordination:</b> {care_coord}<br>
                <b>Patient Education:</b> {pt_ed}
                <b>Follow-up:</b> {followup}<br>
                <b>Preventive Care:</b> {preventive}
              </div>
            </details>
            <details>
              <summary><b>BILLING INFORMATION</b></summary>
              <div>
                <b>CPT Code:</b> {cpt}<br>
                <b>Visit Complexity:</b> {complexity}<br>
                <b>ICD-10 Codes:</b> {icd10}
              </div>
            </details>
            """

    class Config:
        json_encoders = {date: lambda v: v.isoformat()}
        json_schema_extra = {
            "example": {
                "visit_date": "2024-06-14",
                "subjective": {
                    "patient_name": "José Garcia",
                    "age": 67,
                    "gender": "male",
                    "ethnicity": "Hispanic",
                    "chief_complaint": "Burning and tingling pain in right foot",
                    "history_present_illness": "67-year-old male reports burning and tingling in right foot, especially when standing after prolonged sitting. Symptoms have worsened recently.",
                    "medical_history": [
                        "Type 2 diabetes (15 years)",
                        "Hypertension",
                        "Hyperlipidemia",
                        "CKD Stage 3",
                    ],
                    "social_history": {
                        "living_situation": "Lives alone",
                        "occupation": "Retired construction worker",
                        "transportation_barriers": True,
                        "food_insecurity": True,
                    },
                },
                "assessment": {
                    "primary_diagnoses": [
                        {
                            "condition": "Diabetic peripheral neuropathy",
                            "icd10_code": "E11.40",
                            "status": "worsening",
                        }
                    ]
                },
                "billing_info": {
                    "cpt_code": "99214",
                    "icd10_codes": ["E11.40", "I10", "N18.3", "Z59.4"],
                },
            }
        }
