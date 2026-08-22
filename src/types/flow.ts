export type DataType = 'number' | 'string' | 'boolean' | 'array' | 'any';

export type PortType = 'previous' | 'next' | 'input' | 'output';

export type Category = 
  | 'start' 
  | 'void' 
  | 'math' 
  | 'string'
  | 'logic' 
  | 'conditional' 
  | 'loop' 
  | 'variable' 
  | 'function'
  | 'array'
  | 'timing'
  | 'comment';

export interface PortData {
  id: string;
  title?: string | null;
  value?: string | number | boolean | any[];
  dataType?: DataType;
  order?: number;
}

export interface NodeData {
  id: string;
  title: string;
  type: 'core' | 'variable' | 'function' | 'comment';
  category: Category;
  width: number;
  height?: number;
  commentText?: string;
  position?: { x: number; y: number };
  previous: Record<string | number, PortData>;
  next: Record<string | number, PortData>;
  input: Record<string | number, PortData>;
  output: Record<string | number, PortData>;
  dataType?: DataType;
  isDeclared?: boolean;
  children?: NodeData[];
}

export interface WireData {
  id: string;
  originPortId: string;
  targetPortId: string;
}

export interface VariableData {
  name: string;
  dataType: DataType;
  value: string | number | boolean | any[];
  isDeclared?: boolean;
}

export interface FunctionParam {
  name: string;
  dataType: DataType;
}

export interface FunctionData {
  name: string;
  params: FunctionParam[];
  returnType?: DataType;
  nodes?: NodeData[];
  wires?: WireData[];
}

export type ActiveScope = { type: 'main' } | { type: 'function'; name: string };

export interface StageData {
  position: { x: number; y: number };
  scale: { x: number; y: number };
}

export interface VisflowFile {
  stageData: StageData;
  nodes: {
    nodeData: NodeData[];
    wireData: WireData[];
  };
  variables: VariableData[];
  functions: FunctionData[];
}

export interface FileItem {
  fileName: string;
  filePath: string;
}
