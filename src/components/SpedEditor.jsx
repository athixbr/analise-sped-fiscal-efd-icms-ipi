import React, { useState, useMemo, useEffect } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Edit3, 
  FileText, 
  Search, 
  X, 
  FileX,
  ChevronRight,
  ChevronDown,
  FileIcon,
  Package,
  BarChart3
} from "lucide-react";

const SpedEditor = ({ spedData, arquivoInfo, onBack }) => {
  // Estados para edição
  const [editData, setEditData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [treeData, setTreeData] = useState([]); // Dados em árvore
  
  // Estados para abas
  const [activeTab, setActiveTab] = useState('saidas'); // 'saidas', 'entradas'
  
  // Estados para expansão da árvore
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  
  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterCampo, setFilterCampo] = useState('');
  const [filterValor, setFilterValor] = useState('');
  
  // Estados para seleção e edição
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingCell, setEditingCell] = useState(null); // { nodeId, field }
  const [editingValue, setEditingValue] = useState('');
  const [batchEditModal, setBatchEditModal] = useState(false);
  const [batchField, setBatchField] = useState('');
  const [batchValue, setBatchValue] = useState('');

  // Inicializar dados editáveis
  useEffect(() => {
    if (spedData) {
      setEditData(JSON.parse(JSON.stringify(spedData)));
    }
  }, [spedData]);

  // Transformar dados em estrutura de árvore hierárquica
  useEffect(() => {
    if (!editData) return;
    
    const tree = [];
    let nodeId = 0;

    // Processar SAÍDAS (C100 com seus filhos C170 e C190)
    const processSaidas = (notas) => {
      (notas || []).forEach(nota => {
        const notaNode = {
          id: `c100-${nodeId++}`,
          type: 'C100',
          categoria: 'saidas',
          level: 0,
          isExpandable: true,
          icon: FileIcon,
          dados: {
            numeroNota: nota.numeroDoc || nota.numeroNota || '',
            serie: nota.serie || '001',
            dataEmissao: nota.dataDocumento || nota.dataEmissao || '',
            participante: nota.participante || '',
            valorTotal: nota.valorDocumento || nota.valorTotal || 0,
            cfop: nota.cfop || '',
            chaveNfe: nota.chaveNfe || '',
            situacao: nota.situacao || '',
            baseCalculoIcms: nota.baseCalculoIcms || 0,
            valorIcms: nota.valorIcms || 0,
            valorIpi: nota.valorIpi || 0,
            valorPis: nota.valorPis || 0,
            valorCofins: nota.valorCofins || 0
          },
          children: []
        };

        // Seção de Itens da Nota (C170) - se houver itens
        if (nota.itensC170 && nota.itensC170.length > 0) {
          const itensSection = {
            id: `itens-section-${nodeId++}`,
            type: 'ITENS_SECTION',
            categoria: 'saidas',
            level: 1,
            isExpandable: true,
            icon: Package,
            parentId: notaNode.id,
            dados: {
              titulo: '📋 Itens da Nota (C170)',
              totalItens: nota.itensC170.length
            },
            children: []
          };

          // Adicionar itens C170
          (nota.itensC170 || []).forEach(item => {
            itensSection.children.push({
              id: `c170-${nodeId++}`,
              type: 'C170',
              categoria: 'saidas',
              level: 2,
              isExpandable: false,
              icon: Package,
              parentId: itensSection.id,
              dados: {
                numeroItem: item.numeroItem || '',
                codigoProduto: item.codigoProduto || '',
                descricaoProduto: item.descricaoProduto || '',
                quantidade: item.quantidade || 0,
                unidade: item.unidade || '',
                valorUnitario: item.valorUnitario || 0,
                valorTotal: item.valorTotal || 0,
                cfop: item.cfop || '',
                cstIcms: item.cst || item.cstIcms || '',
                aliqIcms: item.aliqIcms || 0,
                valorBcIcms: item.valorBcIcms || 0,
                valorIcms: item.valorIcms || 0,
                cstIpi: item.cstIpi || '',
                aliqIpi: item.aliqIpi || 0,
                vlIpi: item.vlIpi || 0,
                cstPis: item.cstPis || '',
                aliqPis: item.aliqPis || 0,
                vlPis: item.vlPis || 0,
                cstCofins: item.cstCofins || '',
                aliqCofins: item.aliqCofins || 0,
                vlCofins: item.vlCofins || 0
              }
            });
          });
          
          notaNode.children.push(itensSection);
        }

        // Seção de Totais por CFOP (C190) - se houver itens
        if (nota.itens && nota.itens.length > 0) {
          const totaisSection = {
            id: `totais-section-${nodeId++}`,
            type: 'TOTAIS_SECTION',
            categoria: 'saidas',
            level: 1,
            isExpandable: true,
            icon: BarChart3,
            parentId: notaNode.id,
            dados: {
              titulo: '📊 Totais por CFOP (C190)',
              totalCfops: nota.itens.length
            },
            children: []
          };

          // Adicionar totais C190
          (nota.itens || []).forEach(item => {
            totaisSection.children.push({
              id: `c190-${nodeId++}`,
              type: 'C190',
              categoria: 'saidas',
              level: 2,
              isExpandable: false,
              icon: BarChart3,
              parentId: totaisSection.id,
              dados: {
                cfop: item.cfop || '',
                cstIcms: item.cstIcms || '',
                aliquota: item.aliquota || item.aliqIcms || 0,
                valorOperacao: item.valorOperacao || 0,
                valorTotal: item.valorTotal || 0,
                baseCalculo: item.baseCalculo || 0,
                valorBcIcms: item.valorBcIcms || 0,
                valorIcms: item.valorIcms || 0,
                valorBcIcmsSt: item.valorBcIcmsSt || 0,
                valorIcmsSt: item.valorIcmsSt || 0,
                valorReducaoBC: item.valorReducaoBC || 0,
                valorIpi: item.valorIpi || 0
              }
            });
          });

          notaNode.children.push(totaisSection);
        }

        tree.push(notaNode);
      });
    };

    // Processar ENTRADAS (D100 com seus filhos D170 e D190)
    const processEntradas = (entradas) => {
      (entradas || []).forEach(entrada => {
        const entradaNode = {
          id: `d100-${nodeId++}`,
          type: 'D100',
          categoria: 'entradas',
          level: 0,
          isExpandable: true,
          icon: FileIcon,
          dados: {
            numeroNota: entrada.numeroDoc || entrada.numeroNota || '',
            serie: entrada.serie || '001',
            dataEmissao: entrada.dataDocumento || entrada.dataEmissao || '',
            participante: entrada.participante || '',
            valorTotal: entrada.valorDocumento || entrada.valorTotal || 0,
            cfop: entrada.cfop || '',
            chaveNfe: entrada.chaveNfe || '',
            situacao: entrada.situacao || '',
            baseCalculoIcms: entrada.baseCalculoIcms || 0,
            valorIcms: entrada.valorIcms || 0,
            valorIpi: entrada.valorIpi || 0,
            valorPis: entrada.valorPis || 0,
            valorCofins: entrada.valorCofins || 0
          },
          children: []
        };

        // Seção de Itens da Nota (D170) - se houver itens
        if (entrada.itensD170 && entrada.itensD170.length > 0) {
          const itensSection = {
            id: `itens-section-${nodeId++}`,
            type: 'ITENS_SECTION',
            categoria: 'entradas',
            level: 1,
            isExpandable: true,
            icon: Package,
            parentId: entradaNode.id,
            dados: {
              titulo: '📋 Itens da Nota (D170)',
              totalItens: entrada.itensD170.length
            },
            children: []
          };

          // Adicionar itens D170
          (entrada.itensD170 || []).forEach(item => {
            itensSection.children.push({
              id: `d170-${nodeId++}`,
              type: 'D170',
              categoria: 'entradas',
              level: 2,
              isExpandable: false,
              icon: Package,
              parentId: itensSection.id,
              dados: {
                numeroItem: item.numeroItem || '',
                codigoProduto: item.codigoProduto || '',
                descricaoProduto: item.descricaoProduto || '',
                quantidade: item.quantidade || 0,
                unidade: item.unidade || '',
                valorUnitario: item.valorUnitario || 0,
                valorTotal: item.valorTotal || 0,
                cfop: item.cfop || '',
                cstIcms: item.cst || item.cstIcms || '',
                aliqIcms: item.aliqIcms || 0,
                valorBcIcms: item.valorBcIcms || 0,
                valorIcms: item.valorIcms || 0,
                cstIpi: item.cstIpi || '',
                aliqIpi: item.aliqIpi || 0,
                vlIpi: item.vlIpi || 0,
                cstPis: item.cstPis || '',
                aliqPis: item.aliqPis || 0,
                vlPis: item.vlPis || 0,
                cstCofins: item.cstCofins || '',
                aliqCofins: item.aliqCofins || 0,
                vlCofins: item.vlCofins || 0
              }
            });
          });
          
          entradaNode.children.push(itensSection);
        }

        // Seção de Totais por CFOP (D190) - se houver itens
        if (entrada.itens && entrada.itens.length > 0) {
          const totaisSection = {
            id: `totais-section-${nodeId++}`,
            type: 'TOTAIS_SECTION',
            categoria: 'entradas',
            level: 1,
            isExpandable: true,
            icon: BarChart3,
            parentId: entradaNode.id,
            dados: {
              titulo: '📊 Totais por CFOP (D190)',
              totalCfops: entrada.itens.length
            },
            children: []
          };

          // Adicionar totais D190
          (entrada.itens || []).forEach(item => {
            totaisSection.children.push({
              id: `d190-${nodeId++}`,
              type: 'D190',
              categoria: 'entradas',
              level: 2,
              isExpandable: false,
              icon: BarChart3,
              parentId: totaisSection.id,
              dados: {
                cfop: item.cfop || '',
                cstIcms: item.cstIcms || '',
                aliquota: item.aliquota || item.aliqIcms || 0,
                valorOperacao: item.valorOperacao || 0,
                valorTotal: item.valorTotal || 0,
                baseCalculo: item.baseCalculo || 0,
                valorBcIcms: item.valorBcIcms || 0,
                valorIcms: item.valorIcms || 0,
                valorBcIcmsSt: item.valorBcIcmsSt || 0,
                valorIcmsSt: item.valorIcmsSt || 0,
                valorReducaoBC: item.valorReducaoBC || 0,
                valorIpi: item.valorIpi || 0
              }
            });
          });

          entradaNode.children.push(totaisSection);
        }

        tree.push(entradaNode);
      });
    };

    processSaidas(editData.saidas);
    processEntradas(editData.entradas);

    setTreeData(tree);
  }, [editData]);

  // Filtrar e achatar árvore para exibição
  const filteredTreeData = useMemo(() => {
    const flattenTree = (nodes, parentExpanded = true) => {
      const result = [];
      
      nodes.forEach(node => {
        // Filtrar por aba ativa
        if (activeTab === 'saidas' && node.categoria !== 'saidas') return;
        if (activeTab === 'entradas' && node.categoria !== 'entradas') return;
        
        // Filtro por tipo
        if (filterTipo && node.type !== filterTipo) return;
        
        // Filtro por campo específico
        if (filterCampo && filterValor) {
          const valorCampo = node.dados[filterCampo];
          if (!valorCampo || !String(valorCampo).toLowerCase().includes(filterValor.toLowerCase())) {
            return;
          }
        }
        
        // Busca geral
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const allValues = Object.values(node.dados).join(' ').toLowerCase();
          if (!allValues.includes(searchLower)) return;
        }
        
        if (parentExpanded) {
          result.push(node);
          
          // Se o nó está expandido, adicionar os filhos
          if (node.children && expandedNodes.has(node.id)) {
            result.push(...flattenTree(node.children, true));
          }
        }
      });
      
      return result;
    };
    
    return flattenTree(treeData);
  }, [treeData, searchTerm, filterTipo, filterCampo, filterValor, activeTab, expandedNodes]);

  // Manipuladores de eventos para árvore
  const handleToggleExpand = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredTreeData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredTreeData.map(node => node.id));
    }
  };

  // Edição inline de células
  const handleCellClick = (nodeId, field, currentValue) => {
    setEditingCell({ nodeId, field });
    setEditingValue(String(currentValue));
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    
    setTreeData(prev => 
      prev.map(node => {
        if (node.id === editingCell.nodeId) {
          return {
            ...node,
            dados: {
              ...node.dados,
              [editingCell.field]: editingValue
            }
          };
        }
        
        // Verificar nos filhos
        if (node.children) {
          const updatedChildren = node.children.map(child => {
            if (child.id === editingCell.nodeId) {
              return {
                ...child,
                dados: {
                  ...child.dados,
                  [editingCell.field]: editingValue
                }
              };
            }
            return child;
          });
          
          if (updatedChildren !== node.children) {
            return { ...node, children: updatedChildren };
          }
        }
        
        return node;
      })
    );
    
    setEditingCell(null);
    setEditingValue('');
    setHasChanges(true);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  // Componente de célula editável
  const EditableCell = ({ node, field, value }) => {
    const isEditing = editingCell?.nodeId === node.id && editingCell?.field === field;
    
    if (isEditing) {
      return (
        <input
          type="text"
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={handleCellSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCellSave();
            if (e.key === 'Escape') handleCellCancel();
          }}
          className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
      );
    }
    
    return (
      <span
        onClick={() => handleCellClick(node.id, field, value)}
        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded text-sm block"
        title="Clique para editar"
      >
        {value || '-'}
      </span>
    );
  };

  const handleBatchEdit = () => {
    setBatchEditModal(true);
  };

  const getCommonFields = () => {
    if (selectedRows.length === 0) return [];
    
    const selectedData = filteredTreeData.filter(node => selectedRows.includes(node.id));
    const firstNodeFields = Object.keys(selectedData[0]?.dados || {});
    
    return firstNodeFields.filter(field => 
      selectedData.every(node => Object.prototype.hasOwnProperty.call(node.dados, field))
    );
  };

  const handleBatchSave = () => {
    if (!batchField || !batchValue) return;
    
    setTreeData(prev => 
      prev.map(node => {
        if (selectedRows.includes(node.id)) {
          return {
            ...node,
            dados: {
              ...node.dados,
              [batchField]: batchValue
            }
          };
        }
        
        // Verificar nos filhos
        if (node.children) {
          const updatedChildren = node.children.map(child => {
            if (selectedRows.includes(child.id)) {
              return {
                ...child,
                dados: {
                  ...child.dados,
                  [batchField]: batchValue
                }
              };
            }
            return child;
          });
          
          if (updatedChildren !== node.children) {
            return { ...node, children: updatedChildren };
          }
        }
        
        return node;
      })
    );
    
    setBatchEditModal(false);
    setBatchField('');
    setBatchValue('');
    setHasChanges(true);
  };

  // Função para gerar arquivo SPED TXT expandido da árvore
  const generateSpedText = () => {
    let spedText = '';
    
    // Achatar árvore e agrupar por tipo
    const flatNodes = [];
    treeData.forEach(node => {
      flatNodes.push(node);
      if (node.children) {
        flatNodes.push(...node.children);
      }
    });
    
    const registrosPorTipo = flatNodes.reduce((acc, node) => {
      const tipo = node.type;
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(node);
      return acc;
    }, {});

    // Gerar cabeçalho da empresa
    if (editData.companyName || editData.cnpj) {
      spedText += `|0000|014|0|${editData.periodo?.inicio || ''}|${editData.periodo?.fim || ''}|${editData.companyName || ''}|${editData.cnpj || ''}|${editData.inscricaoEstadual || ''}|||\n`;
    }

    // Gerar registros C100 (saídas)
    if (registrosPorTipo['C100']) {
      registrosPorTipo['C100'].forEach(node => {
        const dados = node.dados;
        spedText += `|C100|0|1|${dados.chaveNfe || ''}|2|00|${dados.numeroNota}|${dados.serie}|${dados.dataEmissao}|${dados.participante}|${dados.valorTotal}|${dados.baseCalculoIcms || ''}|${dados.valorIcms || ''}|${dados.valorIpi || ''}|${dados.valorPis || ''}|${dados.valorCofins || ''}|\n`;
      });
    }

    // Gerar registros C170 (itens de saída)
    if (registrosPorTipo['C170']) {
      registrosPorTipo['C170'].forEach(node => {
        const dados = node.dados;
        spedText += `|C170|${dados.numeroItem}|${dados.codigoProduto}|${dados.descricaoProduto}|${dados.cfop}|${dados.unidade}|${dados.quantidade}|${dados.valorUnitario}|${dados.valorTotal}|${dados.aliqIcms || ''}|${dados.valorBcIcms || ''}|${dados.valorIcms || ''}|${dados.cstIpi || ''}|${dados.aliqIpi || ''}|${dados.vlIpi || ''}|${dados.cstPis || ''}|${dados.aliqPis || ''}|${dados.vlPis || ''}|${dados.cstCofins || ''}|${dados.aliqCofins || ''}|${dados.vlCofins || ''}|\n`;
      });
    }

    // Gerar registros C190 (totais por CFOP de saída)
    if (registrosPorTipo['C190']) {
      registrosPorTipo['C190'].forEach(node => {
        const dados = node.dados;
        spedText += `|C190|${dados.cstIcms || ''}|${dados.cfop || ''}|${dados.aliquota || ''}|${dados.valorOperacao || ''}|${dados.valorBcIcms || ''}|${dados.valorIcms || ''}|${dados.valorBcIcmsSt || ''}|${dados.valorIcmsSt || ''}|${dados.valorReducaoBC || ''}|${dados.valorIpi || ''}|\n`;
      });
    }

    // Gerar registros D100 (entradas)
    if (registrosPorTipo['D100']) {
      registrosPorTipo['D100'].forEach(node => {
        const dados = node.dados;
        spedText += `|D100|0|1|${dados.chaveNfe || ''}|2|00|${dados.numeroNota}|${dados.serie}|${dados.dataEmissao}|${dados.participante}|${dados.valorTotal}|${dados.baseCalculoIcms || ''}|${dados.valorIcms || ''}|${dados.valorIpi || ''}|${dados.valorPis || ''}|${dados.valorCofins || ''}|\n`;
      });
    }

    // Gerar registros D170 (itens de entrada)
    if (registrosPorTipo['D170']) {
      registrosPorTipo['D170'].forEach(node => {
        const dados = node.dados;
        spedText += `|D170|${dados.numeroItem}|${dados.codigoProduto}|${dados.descricaoProduto}|${dados.cfop}|${dados.unidade}|${dados.quantidade}|${dados.valorUnitario}|${dados.valorTotal}|${dados.aliqIcms || ''}|${dados.valorBcIcms || ''}|${dados.valorIcms || ''}|${dados.cstIpi || ''}|${dados.aliqIpi || ''}|${dados.vlIpi || ''}|${dados.cstPis || ''}|${dados.aliqPis || ''}|${dados.vlPis || ''}|${dados.cstCofins || ''}|${dados.aliqCofins || ''}|${dados.vlCofins || ''}|\n`;
      });
    }

    // Gerar registros D190 (totais por CFOP de entrada)
    if (registrosPorTipo['D190']) {
      registrosPorTipo['D190'].forEach(node => {
        const dados = node.dados;
        spedText += `|D190|${dados.cstIcms || ''}|${dados.cfop || ''}|${dados.aliquota || ''}|${dados.valorOperacao || ''}|${dados.valorBcIcms || ''}|${dados.valorIcms || ''}|${dados.valorBcIcmsSt || ''}|${dados.valorIcmsSt || ''}|${dados.valorReducaoBC || ''}|${dados.valorIpi || ''}|\n`;
      });
    }
    
    // Registros de encerramento
    spedText += "|E001|0|\n";
    spedText += "|E100|0|\n";
    spedText += "|E200|0|\n";
    spedText += "|H001|0|\n";
    spedText += "|H005|0|\n";
    spedText += "|G001|0|\n";
    spedText += "|9001|0|\n";
    spedText += "|9900|0000|1|\n";
    spedText += "|9999|1|\n";
    
    return spedText;
  };

  const handleSave = () => {
    // TODO: Implementar salvamento das alterações no banco
    setHasChanges(false);
    alert('Alterações salvas com sucesso!');
  };

  const handleExport = () => {
    try {
      const spedContent = generateSpedText();
      const blob = new Blob([spedContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${arquivoInfo?.name?.replace('.txt', '') || 'sped'}_editado_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar arquivo SPED');
    }
  };

  if (!spedData) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Edit3 className="h-6 w-6" />
                Editor SPED
              </h1>
              <p className="text-muted-foreground">
                Edite os dados do arquivo SPED de forma estruturada
              </p>
            </div>
          </div>
        </div>

        <Card className="p-8 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum SPED carregado</h3>
          <p className="text-muted-foreground mb-4">
            Para usar o editor, primeiro carregue um arquivo SPED através da página principal.
          </p>
          <Button onClick={onBack} className="flex items-center gap-2 mx-auto">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Edit3 className="h-6 w-6" />
              Editor SPED
            </h1>
            <p className="text-muted-foreground">
              {arquivoInfo?.name || "Arquivo SPED"} - {spedData.companyName || "Empresa"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
              Alterações não salvas
            </span>
          )}
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar TXT
          </Button>
        </div>
      </div>

      {/* Informações da Empresa */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">📊 Informações da Empresa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Empresa</label>
            <p className="text-sm bg-muted p-2 rounded">
              {spedData.companyName || "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CNPJ</label>
            <p className="text-sm bg-muted p-2 rounded">
              {spedData.cnpj || "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Período</label>
            <p className="text-sm bg-muted p-2 rounded">
              {spedData.periodo?.inicio && spedData.periodo?.fim
                ? `${new Date(spedData.periodo.inicio).toLocaleDateString()} a ${new Date(spedData.periodo.fim).toLocaleDateString()}`
                : "Não informado"}
            </p>
          </div>
        </div>
      </Card>

      {/* Resumo dos Dados */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">📈 Resumo dos Dados</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{spedData.entradas?.length || 0}</p>
            <p className="text-sm text-green-700 dark:text-green-300">Notas de Entrada</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{spedData.saidas?.length || 0}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Notas de Saída</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {(spedData.entradas?.length || 0) + (spedData.saidas?.length || 0)}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300">Total de Notas</p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              R$ {(spedData.totalGeral || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300">Valor Total</p>
          </div>
        </div>
      </Card>

      {/* Tabela de Edição com Abas */}
      <Card className="p-6">
        {/* Sistema de Abas */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('saidas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'saidas'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📤 Saídas (C100/C170/C190)
              <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                {treeData.filter(r => r.categoria === 'saidas').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('entradas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'entradas'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📥 Entradas (D100/D170/D190)
              <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                {treeData.filter(r => r.categoria === 'entradas').length}
              </span>
            </button>
          </nav>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            📝 Editor {activeTab === 'saidas' ? 'de Saídas' : 'de Entradas'}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRows([])}
              disabled={selectedRows.length === 0}
            >
              Limpar Seleção
            </Button>
            <Button
              size="sm"
              onClick={handleBatchEdit}
              disabled={selectedRows.length === 0}
            >
              Edição em Lote ({selectedRows.length})
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar em todos os campos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Registro</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Todos os tipos</option>
              <option value="0000">0000 - Cabeçalho</option>
              {activeTab === 'saidas' && (
                <>
                  <option value="C100">C100 - Notas Fiscais de Saída</option>
                  <option value="C170">C170 - Itens de Saída</option>
                  <option value="C190">C190 - Totais por CFOP de Saída</option>
                </>
              )}
              {activeTab === 'entradas' && (
                <>
                  <option value="D100">D100 - Notas Fiscais de Entrada</option>
                  <option value="D170">D170 - Itens de Entrada</option>
                  <option value="D190">D190 - Totais por CFOP de Entrada</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Campo</label>
            <select
              value={filterCampo}
              onChange={(e) => setFilterCampo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Todos os campos</option>
              <option value="numeroNota">Número da Nota</option>
              <option value="razaoSocial">Razão Social</option>
              <option value="cnpj">CNPJ</option>
              <option value="cfop">CFOP</option>
              <option value="valorTotal">Valor Total</option>
              <option value="participante">Participante</option>
              <option value="dataEmissao">Data de Emissão</option>
              <option value="descricaoProduto">Descrição do Produto</option>
              <option value="codigoProduto">Código do Produto</option>
              <option value="serie">Série</option>
              <option value="quantidade">Quantidade</option>
              <option value="unidade">Unidade</option>
              <option value="valorUnitario">Valor Unitário</option>
              <optgroup label="Campos ICMS">
                <option value="aliqIcms">Alíquota ICMS</option>
                <option value="valorBcIcms">Base Cálculo ICMS</option>
                <option value="valorIcms">Valor ICMS</option>
              </optgroup>
              <optgroup label="Campos IPI">
                <option value="cstIpi">CST IPI</option>
                <option value="aliqIpi">Alíquota IPI</option>
                <option value="vlIpi">Valor IPI</option>
              </optgroup>
              <optgroup label="Campos PIS/COFINS">
                <option value="cstPis">CST PIS</option>
                <option value="aliqPis">Alíquota PIS</option>
                <option value="vlPis">Valor PIS</option>
                <option value="cstCofins">CST COFINS</option>
                <option value="aliqCofins">Alíquota COFINS</option>
                <option value="vlCofins">Valor COFINS</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valor</label>
            <input
              type="text"
              placeholder="Valor para filtrar..."
              value={filterValor}
              onChange={(e) => setFilterValor(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>

        {/* Controles da Tabela */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredTreeData.length} registros encontrados
            </span>
            {selectedRows.length > 0 && (
              <span className="text-sm text-blue-600">
                • {selectedRows.length} selecionados
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedRows.length === filteredTreeData.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </Button>
          </div>
        </div>

        {/* Tabela Excel-Style */}
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="w-12 p-2 text-left border-r border-gray-300 dark:border-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredTreeData.length && filteredTreeData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="p-2 text-left font-semibold border-r border-gray-300 dark:border-gray-600 min-w-16">Tipo</th>
                  <th className="p-2 text-left font-semibold border-r border-gray-300 dark:border-gray-600 min-w-80">Descrição</th>
                  <th className="p-2 text-left font-semibold border-r border-gray-300 dark:border-gray-600 min-w-20">CST ICMS</th>
                  <th className="p-2 text-left font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24">Data Doc</th>
                  <th className="p-2 text-left font-semibold border-r border-gray-300 dark:border-gray-600 min-w-40">Participante</th>
                  <th className="p-2 text-left font-semibold border-r border-gray-300 dark:border-gray-600 min-w-20">CFOP</th>
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24">Valor Operação</th>
                  
                  {/* Campos ICMS */}
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-20 bg-blue-50 dark:bg-blue-900/20">
                    Aliq ICMS
                  </th>
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24 bg-blue-50 dark:bg-blue-900/20">
                    BC ICMS
                  </th>
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24 bg-blue-50 dark:bg-blue-900/20">
                    Vlr ICMS
                  </th>
                  
                  {/* Campos ICMS ST */}
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24 bg-cyan-50 dark:bg-cyan-900/20">
                    BC ICMS ST
                  </th>
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24 bg-cyan-50 dark:bg-cyan-900/20">
                    Vlr ICMS ST
                  </th>
                  
                  {/* Campos IPI */}
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24 bg-orange-50 dark:bg-orange-900/20">
                    Vlr IPI
                  </th>
                  
                  {/* Campos PIS/COFINS */}
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24 bg-green-50 dark:bg-green-900/20">
                    Vlr PIS
                  </th>
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-20 bg-green-50 dark:bg-green-900/20">
                    Aliq PIS
                  </th>
                  <th className="p-2 text-right font-semibold border-r border-gray-300 dark:border-gray-600 min-w-24 bg-purple-50 dark:bg-purple-900/20">
                    Vlr COFINS
                  </th>
                  <th className="p-2 text-right font-semibold min-w-20 bg-purple-50 dark:bg-purple-900/20">
                    Aliq COFINS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTreeData.map((node) => {
                  const dados = node.dados;
                  const IconComponent = node.icon;
                  
                  return (
                    <tr
                      key={node.id}
                      className={`border-t border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        selectedRows.includes(node.id) 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : 'bg-white dark:bg-transparent'
                      }`}
                    >
                      <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(node.id)}
                            onChange={() => handleRowSelect(node.id)}
                            className="rounded"
                          />
                          {/* Indentação para hierarquia */}
                          <div style={{ marginLeft: `${node.level * 20}px` }} className="flex items-center gap-1">
                            {node.isExpandable && (
                              <button
                                onClick={() => handleToggleExpand(node.id)}
                                className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1"
                              >
                                {expandedNodes.has(node.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                            <IconComponent className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </td>
                      <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                        <span className="font-mono text-xs font-medium bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                          {node.type}
                        </span>
                      </td>
                      
                      {/* Conteúdo principal baseado no tipo */}
                      {node.type.startsWith('C100') || node.type.startsWith('D100') ? (
                        // Linha de Nota Fiscal (cabeçalho expansível)
                        <>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 font-medium">
                            🧾 NF: {dados.numeroNota} | Série: {dados.serie} | {dados.dataEmissao ? new Date(dados.dataEmissao).toLocaleDateString('pt-BR') : ''} | R$ {Number(dados.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            <EditableCell node={node} field="cstIcms" value={dados.situacao || ''} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            <EditableCell node={node} field="dataEmissao" value={dados.dataEmissao} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            <EditableCell node={node} field="participante" value={dados.participante} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-center">
                            <EditableCell node={node} field="cfop" value={dados.cfop} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right font-medium">
                            <EditableCell 
                              node={node} 
                              field="valorTotal" 
                              value={dados.valorTotal ? 
                                `${Number(dados.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                                : ''
                              } 
                            />
                          </td>
                          {/* Campos tributários vazios para notas */}
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-blue-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-blue-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-blue-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-cyan-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-cyan-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-orange-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-green-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-green-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-purple-50/50">-</td>
                          <td className="p-2 bg-purple-50/50">-</td>
                        </>
                      ) : node.type === 'ITENS_SECTION' ? (
                        // Linha de Seção de Itens
                        <>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 font-medium text-blue-700 dark:text-blue-400 bg-blue-50/30" colSpan="17">
                            {dados.titulo} ({dados.totalItens} itens)
                          </td>
                        </>
                      ) : node.type === 'TOTAIS_SECTION' ? (
                        // Linha de Seção de Totais
                        <>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 font-medium text-green-700 dark:text-green-400 bg-green-50/30" colSpan="17">
                            {dados.titulo} ({dados.totalCfops} CFOPs)
                          </td>
                        </>
                      ) : node.type.endsWith('170') ? (
                        // Linha de Item (com todos os campos tributários)
                        <>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            Item {dados.numeroItem} - {dados.descricaoProduto} | CFOP {dados.cfop} | Qtd: {dados.quantidade} {dados.unidade} | Vlr Unit: R$ {Number(dados.valorUnitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            <EditableCell node={node} field="cstIcms" value={dados.cstIcms} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            <EditableCell node={node} field="codigoProduto" value={dados.codigoProduto} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            <EditableCell node={node} field="quantidade" value={`${dados.quantidade} ${dados.unidade}`} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-center">
                            <EditableCell node={node} field="cfop" value={dados.cfop} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right">
                            <EditableCell node={node} field="valorTotal" value={dados.valorTotal} />
                          </td>
                          
                          {/* Campos ICMS */}
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-blue-50/50">
                            <EditableCell node={node} field="aliqIcms" value={dados.aliqIcms ? `${dados.aliqIcms}%` : ''} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-blue-50/50">
                            <EditableCell node={node} field="valorBcIcms" value={dados.valorBcIcms} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-blue-50/50">
                            <EditableCell node={node} field="valorIcms" value={dados.valorIcms} />
                          </td>
                          
                          {/* Campos ICMS ST */}
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-cyan-50/50">
                            <EditableCell node={node} field="valorBcIcmsSt" value={dados.valorBcIcmsSt || 0} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-cyan-50/50">
                            <EditableCell node={node} field="valorIcmsSt" value={dados.valorIcmsSt || 0} />
                          </td>
                          
                          {/* Campos IPI */}
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-orange-50/50">
                            <EditableCell node={node} field="vlIpi" value={dados.vlIpi} />
                          </td>
                          
                          {/* Campos PIS/COFINS */}
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-green-50/50">
                            <EditableCell node={node} field="vlPis" value={dados.vlPis} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-green-50/50">
                            <EditableCell node={node} field="aliqPis" value={dados.aliqPis ? `${dados.aliqPis}%` : ''} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-purple-50/50">
                            <EditableCell node={node} field="vlCofins" value={dados.vlCofins} />
                          </td>
                          <td className="p-2 bg-purple-50/50 text-right">
                            <EditableCell node={node} field="aliqCofins" value={dados.aliqCofins ? `${dados.aliqCofins}%` : ''} />
                          </td>
                        </>
                      ) : node.type.endsWith('190') ? (
                        // Linha de Total (C190/D190)
                        <>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 font-medium">
                            CFOP {dados.cfop} | CST: {dados.cstIcms} | Aliq ICMS: {dados.aliquota}% | BC: R$ {Number(dados.valorBcIcms || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | ICMS: R$ {Number(dados.valorIcms || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">
                            <EditableCell node={node} field="cstIcms" value={dados.cstIcms} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-center">
                            <EditableCell node={node} field="cfop" value={dados.cfop} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right font-medium">
                            <EditableCell node={node} field="valorOperacao" value={dados.valorOperacao} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-blue-50/50">
                            <EditableCell node={node} field="aliquota" value={dados.aliquota ? `${dados.aliquota}%` : ''} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-blue-50/50">
                            <EditableCell node={node} field="valorBcIcms" value={dados.valorBcIcms} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-blue-50/50">
                            <EditableCell node={node} field="valorIcms" value={dados.valorIcms} />
                          </td>
                          {/* Campos ICMS ST */}
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-cyan-50/50">
                            <EditableCell node={node} field="valorBcIcmsSt" value={dados.valorBcIcmsSt} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-cyan-50/50">
                            <EditableCell node={node} field="valorIcmsSt" value={dados.valorIcmsSt} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 text-right bg-orange-50/50">
                            <EditableCell node={node} field="valorReducaoBC" value={dados.valorReducaoBC} />
                          </td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-green-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-green-50/50">-</td>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700 bg-purple-50/50">
                            <EditableCell node={node} field="valorIpi" value={dados.valorIpi} />
                          </td>
                          <td className="p-2 bg-purple-50/50">-</td>
                        </>
                      ) : (
                        // Outros tipos
                        <>
                          <td className="p-2 border-r border-gray-200 dark:border-gray-700" colSpan="17">
                            Tipo não reconhecido: {node.type}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTreeData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileX className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum registro encontrado com os filtros aplicados.</p>
          </div>
        )}
      </Card>

      {/* Modal de Edição em Lote */}
      {batchEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  Edição em Lote
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBatchEditModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Campo para editar
                  </label>
                  <select
                    value={batchField}
                    onChange={(e) => setBatchField(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">Selecione um campo</option>
                    {getCommonFields().map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Novo valor
                  </label>
                  <input
                    type="text"
                    value={batchValue}
                    onChange={(e) => setBatchValue(e.target.value)}
                    placeholder="Digite o novo valor..."
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Aplicar alteração em {selectedRows.length} registros selecionados
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setBatchEditModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleBatchSave}
                  disabled={!batchField || !batchValue}
                  className="flex-1"
                >
                  Aplicar Alterações
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SpedEditor;
