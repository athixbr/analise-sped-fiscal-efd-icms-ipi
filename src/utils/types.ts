export type IndicadorOperacao = "0" | "1";

export interface NotaItem {
  cfop: string;
  valorOperacao: number;
  cstIcms: string;
  aliqIcms: number;
  valorBcIcms: number;
  valorIcms: number;
}

export interface NotaItemC170 {
  numItem?: number;
  codItem?: string;
  descrCompl?: string;
  quantidade?: number;
  unidade?: string;
  valorItem?: number;
  valorDesconto?: number;
  cfop?: string;
  cstIcms?: string;
  aliqIcms?: number;
  valorBcIcms?: number;
  valorIcms?: number;
}

// Interface completa para item detalhado (C170/D170) com todos os campos tributários
export interface ItemDetalhadoCompleto {
  // Identificação
  numItem: number;
  codItem: string;
  descrCompl: string;
  
  // Quantidade e Valores
  quantidade: number;
  unidade: string;
  valorItem: number;
  valorDesconto: number;
  indMov: string;
  
  // CFOP e Natureza
  cfop: string;
  codNat: string;
  
  // ICMS
  cstIcms: string;
  vlBcIcms: number;
  aliqIcms: number;
  vlIcms: number;
  vlBcIcmsSt: number;
  aliqSt: number;
  vlIcmsSt: number;
  indApur: string;
  
  // IPI
  cstIpi: string;
  codEnq: string;
  vlBcIpi: number;
  aliqIpi: number;
  vlIpi: number;
  
  // PIS
  cstPis: string;
  vlBcPis: number;
  aliqPis: number;
  quantBcPis: number;
  aliqPisQuant: number;
  vlPis: number;
  
  // COFINS
  cstCofins: string;
  vlBcCofins: number;
  aliqCofins: number;
  quantBcCofins: number;
  aliqCofinsQuant: number;
  vlCofins: number;
  
  // Contábil
  codCta: string;
  vlAbatNt: number;
  
  // Metadados para edição
  tipo: 'saida' | 'entrada'; // C170 ou D170
  documentoId?: string; // ID do documento pai
}

// Interface para documento de entrada (D100)
export interface DocumentoEntrada {
  indOper: string;
  indEmit: string;
  codPart: string;
  codMod: string;
  codSit: string;
  ser: string;
  sub: string;
  numDoc: string;
  chvNfe: string;
  dtDoc: string;
  dtEsS: string;
  vlDoc: number;
  indPgto: string;
  vlDesc: number;
  vlAbatNt: number;
  vlMerc: number;
  indFrt: string;
  vlFrt: number;
  vlSeg: number;
  vlOutDa: number;
  vlBcIcms: number;
  vlIcms: number;
  vlBcIcmsSt: number;
  vlIcmsSt: number;
  codInf: string;
  vlPis: number;
  vlCofins: number;
  codCta: string;
  tpLigacao: string;
  codGrupoTensao: string;
}

export interface Nota {
  numeroDoc: string;
  chaveNfe: string;
  dataDocumento: Date | null;
  dataEntradaSaida: Date | null;
  valorDocumento: number;
  valorMercadoria: number;
  indicadorOperacao: IndicadorOperacao;
  situacao: string;
  itens: NotaItem[];
  itensC170?: NotaItemC170[];
}

export interface Periodo {
  inicio: Date | string | null;
  fim: Date | string | null;
}

export interface DiaValor {
  data: string;
  valor: number;
}

export interface CfopValor {
  cfop: string;
  valor: number;
  descricao?: string;
}

export interface DiaCfopValor {
  data: string;
  cfop: string;
  valor: number;
}

export interface ItemDetalhado {
  cfop: string;
  valorOperacao: number;
  cstIcms: string;
  aliqIcms: number;
  valorBcIcms: number;
  valorIcms: number;
  valorBcIcmsSt?: number;
  valorIcmsSt?: number;
  valorReducaoBC?: number;
  valorIpi?: number;
  numeroDoc: string;
  chaveNfe: string;
  dataDocumento: Date | null;
  dataEntradaSaida: Date | null;
  valorTotal?: number;
  situacao: string;
}

export interface ProcessedData {
  entradas: Nota[];
  saidas: Nota[];
  entradasPorDiaArray?: DiaValor[];
  saidasPorDiaArray?: DiaValor[];
  entradasPorCfopArray?: CfopValor[];
  saidasPorCfopArray?: CfopValor[];
  entradasPorDiaCfopArray?: DiaCfopValor[];
  saidasPorDiaCfopArray?: DiaCfopValor[];
  itensPorCfopIndex?: Record<string, ItemDetalhado[]>;
  totalEntradas: number;
  totalSaidas: number;
  totalGeral: number;
  periodo: Periodo;
  vendas?: Nota[];
  vendasPorDia?: Map<string, number> | undefined;
  vendasPorCfop?: Map<string, number> | undefined;
  vendasPorDiaArray?: DiaValor[];
  vendasPorCfopArray?: CfopValor[];
  // Metadados do arquivo (registro 0000)
  companyName?: string;
  cnpj?: string;
}

// Interface expandida para SpedEditor com dados completos
export interface ProcessedDataComplete extends ProcessedData {
  // Documentos de entrada (D100)
  documentosEntrada: DocumentoEntrada[];
  
  // Itens detalhados completos (C170 + D170)
  itensDetalhadosCompletos: ItemDetalhadoCompleto[];
  
  // Registros D190 (totais de entrada por CFOP)
  totaisEntradaPorCfop: Array<{
    cstIcms: string;
    cfop: string;
    aliqIcms: number;
    vlOper: number;
    vlBcIcms: number;
    vlIcms: number;
    vlBcIcmsSt: number;
    vlIcmsSt: number;
    redBcIcms: number;
    vlIpiCont: number;
    codObs: string;
  }>;
  
  // Metadados para edição
  registrosOriginais: {
    c100: string[]; // Linhas originais C100
    c170: string[]; // Linhas originais C170
    c190: string[]; // Linhas originais C190
    d100: string[]; // Linhas originais D100
    d170: string[]; // Linhas originais D170
    d190: string[]; // Linhas originais D190
  };
}

export type FilteredProcessedData = Omit<
  ProcessedData,
  | "entradasPorDiaArray"
  | "saidasPorDiaArray"
  | "entradasPorDiaCfopArray"
  | "saidasPorDiaCfopArray"
  | "entradasPorCfopArray"
  | "saidasPorCfopArray"
  | "vendasPorDiaArray"
  | "vendasPorCfopArray"
> & {
  entradasPorDiaArray: DiaValor[];
  saidasPorDiaArray: DiaValor[];
  entradasPorDiaCfopArray: DiaCfopValor[];
  saidasPorDiaCfopArray: DiaCfopValor[];
  entradasPorCfopArray: CfopValor[];
  saidasPorCfopArray: CfopValor[];
  vendasPorDiaArray: DiaValor[];
  vendasPorCfopArray: CfopValor[];
};

export interface BasicDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
}

export interface ChartDataShape {
  labels: string[];
  datasets: BasicDataset[];
}

export interface ResumoExecutivo {
  totalVendas: number;
  totalEntradas: number;
  totalSaidas: number;
  numeroNotas: number;
  numeroNotasEntrada: number;
  numeroNotasSaida: number;
  ticketMedio: number;
  cfopPrincipal: CfopValor | null;
  cfopPrincipalEntrada: CfopValor | null;
  cfopPrincipalSaida: CfopValor | null;
  periodoAnalise: string | null;
  tendencia: {
    tendencia: string;
    percentual: number;
    descricao: string;
  } | null;
}

export interface XmlItemResumo {
  cfop: string;
  vProd: number;
  qCom?: number;
  qBCMonoRet?: number;
  vICMSMonoRet?: number;
}

export interface XmlNotaResumo {
  chave: string;
  dhEmi: string;
  dhRecbto?: string;
  dataEmissao: string;
  modelo: string;
  serie: string;
  numero: string;
  cnpjEmit?: string;
  cnpjDest?: string;
  autorizada: boolean;
  valorTotalProduto: number;
  qBCMonoRetTotal?: number;
  vICMSMonoRetTotal?: number;
  itens: XmlItemResumo[];
}

export interface XmlAggDiaCfop {
  data: string;
  cfop: string;
  vProd: number;
  qBCMonoRet?: number;
  vICMSMonoRet?: number;
}

export interface XmlComparativoLinha {
  data: string;
  cfop: string;
  xmlVProd: number;
  spedValorOperacao: number;
  diffAbs: number;
  diffPerc: number;
}

export type DivergenciaLinhaTipo = "AMBOS" | "SOMENTE_XML" | "SOMENTE_SPED";
export interface DivergenciaNotaResumo {
  chave: string;
  valorXml?: number;
  valorSped?: number;
  diff?: number;
  tipo: DivergenciaLinhaTipo;
}
export interface DivergenciaDetalheResultado {
  data: string;
  cfop: string;
  totalXml: number;
  totalSped: number;
  diffAbs: number;
  notas: DivergenciaNotaResumo[];
}
