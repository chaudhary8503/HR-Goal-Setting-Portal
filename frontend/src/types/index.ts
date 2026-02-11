

import { UserProp } from './user';

export interface OKRData {
  department: string;
  jobTitle: string;
  goalDescription: string;
  keyResult: string;
  managersGoal: string;
  startDate: string;
  dueDate: string;
}




export interface OKRFormProps {
  onSubmit: (data: OKRData) => void;
  isLoading?: boolean;
  user?: UserProp;
}

export interface OutputGoalProps{
    title: string;
    description: string;
    kpi: string;
    companyTopBetAlignment: string;
    framework3E: string;
    coreValue: string;
}

export interface AIResultProps {
  goals: Array<OutputGoalProps>;
}


export interface SmartGoalResultsProps {
  okrData: OKRData;
  aiResult?: AIResultProps;
  isFallback?: boolean;
}

export interface OKRContainerProps {
  onSubmit: (data: OKRData, aiResult?: AIResultProps, isFallback?: boolean) => void;
  user?: UserProp;
}