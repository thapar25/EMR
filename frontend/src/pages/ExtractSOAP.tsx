import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { ParsedJsonValue } from "../types";
import { parseJsonValues, formatJsonValue } from "../utils/json";
import { ApiService } from "../services/api";

interface ExtractSOAPProps {
  processedContent: string;
  onPrevious: () => void;
  onReset: () => void;
  onSetError: (error: string | null) => void;
}

export const ExtractSOAP: React.FC<ExtractSOAPProps> = ({
  processedContent,
  onPrevious,
  onReset,
  onSetError,
}) => {
  const navigate = useNavigate();
  const [parsedValues, setParsedValues] = useState<ParsedJsonValue[]>([]);
  const [selectedValue, setSelectedValue] = useState<ParsedJsonValue | null>(
    null,
  );
  const [filterNull, setFilterNull] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [soapData, setSoapData] = useState<any>(null);
  const apiService = ApiService.getInstance();

  useEffect(() => {
    if (processedContent && !soapData) {
      extractSOAPNote();
    }
  }, [processedContent]);

  const extractSOAPNote = async () => {
    if (!processedContent) return;

    setIsExtracting(true);
    onSetError(null);

    try {
      const result = await apiService.extractSOAP(processedContent);

      if (result.success && result.data) {
        setSoapData(result.data);
        const parsed = parseJsonValues(JSON.stringify(result.data));
        setParsedValues(parsed);
      } else {
        onSetError(result.message || "Failed to extract SOAP note");
        createMockSOAPData();
      }
    } catch (error) {
      console.error("SOAP extraction error:", error);
      onSetError("Error extracting SOAP note");
      createMockSOAPData();
    } finally {
      setIsExtracting(false);
    }
  };

  const createMockSOAPData = () => {
    const mockSOAPData = {
      subjective: {
        chief_complaint: "Follow-up visit for hypertension",
        history_present_illness:
          "Patient reports feeling well overall. Blood pressure has been stable at home.",
        review_of_systems: {
          cardiovascular: "No chest pain or palpitations",
          respiratory: "No shortness of breath",
          neurological: null,
          gastrointestinal: null,
        },
        past_medical_history: ["Hypertension", "Type 2 Diabetes"],
        medications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
        allergies: null,
        social_history: {
          smoking: "Former smoker, quit 5 years ago",
          alcohol: "Occasional social drinking",
          exercise: null,
        },
      },
      objective: {
        vital_signs: {
          blood_pressure: "128/82 mmHg",
          heart_rate: "72 bpm",
          temperature: "98.6°F",
          respiratory_rate: null,
          oxygen_saturation: null,
        },
        physical_exam: {
          general: "Well-appearing, no acute distress",
          cardiovascular: "Regular rate and rhythm, no murmurs",
          respiratory: "Clear to auscultation bilaterally",
          neurological: null,
          extremities: null,
        },
        laboratory_results: null,
        imaging_results: null,
      },
      assessment: {
        primary_diagnosis: "Hypertension, well-controlled",
        secondary_diagnoses: ["Type 2 Diabetes Mellitus"],
        clinical_impression:
          "Patient's hypertension remains well-controlled on current regimen.",
        risk_factors: null,
      },
      plan: {
        medications: {
          continue: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
          start: null,
          stop: null,
          modify: null,
        },
        follow_up: "Return in 3 months for routine follow-up",
        patient_education: "Continue current lifestyle modifications",
        referrals: null,
        additional_testing: null,
      },
    };

    setSoapData(mockSOAPData);
    const parsed = parseJsonValues(JSON.stringify(mockSOAPData));
    setParsedValues(parsed);
  };

  const nullValues = parsedValues.filter((v) => v.isNull);
  const nonNullValues = parsedValues.filter((v) => !v.isNull);
  const displayValues = filterNull ? nullValues : parsedValues;

  const getValueTypeColor = (value: any) => {
    if (value === null) return "text-red-600 bg-red-50";
    if (typeof value === "string") return "text-blue-600 bg-blue-50";
    if (typeof value === "number") return "text-green-600 bg-green-50";
    if (typeof value === "boolean") return "text-purple-600 bg-purple-50";
    if (Array.isArray(value)) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  const getValueTypeLabel = (value: any) => {
    if (value === null) return "NULL";
    if (typeof value === "string") return "String";
    if (typeof value === "number") return "Number";
    if (typeof value === "boolean") return "Boolean";
    if (Array.isArray(value)) return "Array";
    if (typeof value === "object") return "Object";
    return "Unknown";
  };

  const handleRetry = () => {
    extractSOAPNote();
  };

  const handlePrevious = () => {
    onPrevious();
    navigate("/summary");
  };

  const handleReset = () => {
    onReset();
    navigate("/upload");
  };

  if (isExtracting) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Extracting SOAP Note
          </h2>
          <p className="text-gray-600">
            Processing your clinical summary to extract structured SOAP note
            data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          SOAP Note Extraction
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Structured clinical data extracted from your summary. Null values are
          highlighted and may indicate areas that need additional information or
          clarification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {parsedValues.length}
          </div>
          <div className="text-sm text-gray-600">Total Fields</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {nonNullValues.length}
          </div>
          <div className="text-sm text-gray-600">Populated Fields</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">
            {nullValues.length}
          </div>
          <div className="text-sm text-gray-600">Missing Fields</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {parsedValues.length > 0
              ? Math.round((nonNullValues.length / parsedValues.length) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              SOAP Note Fields
            </h3>
            <div className="flex items-center space-x-4">
              {nullValues.length > 0 && (
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                  <span className="text-sm text-amber-700">
                    {nullValues.length} missing fields
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterNull}
                    onChange={(e) => setFilterNull(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Show only missing fields
                  </span>
                </label>
              </div>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Re-extract
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SOAP Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayValues.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    item.isNull ? "bg-red-50" : ""
                  }`}
                  onClick={() => setSelectedValue(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {item.path.split(".")[0].toUpperCase()}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getValueTypeColor(
                        item.value,
                      )}`}
                    >
                      {getValueTypeLabel(item.value)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {item.isNull ? (
                      <span className="text-red-600 font-medium">
                        Not extracted
                      </span>
                    ) : (
                      <span className="font-mono text-xs">
                        {formatJsonValue(item.value)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.isNull ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Missing
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Extracted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayValues.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-2">
              <BarChart3 className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">
              {filterNull ? "No missing fields found" : "No data to display"}
            </p>
          </div>
        )}
      </div>

      {selectedValue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Field Details
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SOAP Section
                </label>
                <p className="text-sm text-gray-900 capitalize">
                  {selectedValue.path.split(".")[0]}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Path
                </label>
                <code className="block bg-gray-100 px-3 py-2 rounded text-sm">
                  {selectedValue.path}
                </code>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <p className="text-sm text-gray-900">
                  {selectedValue.key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <pre className="bg-gray-100 px-3 py-2 rounded text-sm overflow-x-auto">
                  {selectedValue.isNull
                    ? "Not extracted from summary"
                    : formatJsonValue(selectedValue.value)}
                </pre>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedValue(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous Step
          </Button>
          <div className="text-sm text-gray-500">
            Step 3 of 3: SOAP Note Complete
          </div>
          <Button
            onClick={handleReset}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Process New Transcript
          </Button>
        </div>
      </div>
    </div>
  );
};
