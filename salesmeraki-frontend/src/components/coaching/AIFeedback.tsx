import { Badge } from '@/components/common/Badge';

interface AIFeedbackProps {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
}

export function AIFeedback({ analysis }: AIFeedbackProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Strengths</h3>
        <div className="space-y-2">
          {analysis.strengths.map((strength, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Badge variant="success">✓</Badge>
              <span>{strength}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Areas for Improvement</h3>
        <div className="space-y-2">
          {analysis.weaknesses.map((weakness, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Badge variant="warning">!</Badge>
              <span>{weakness}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Suggestions</h3>
        <div className="space-y-2">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Badge variant="info">i</Badge>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}