export interface MedicationPreset {
  drugName: string
  dosage: string
  frequency: string
  duration: string
}

// A curated shortlist for autocomplete convenience — the medications most
// commonly prescribed in general/family practice (primer nivel de
// atención) in Ecuador, drawing on the same active ingredients covered by
// the MSP's Cuadro Nacional de Medicamentos Básicos. Defaults are typical
// adult starting points; the doctor edits them per patient as needed.
export const COMMON_MEDICATIONS: MedicationPreset[] = [
  // Analgésicos / antiinflamatorios
  { drugName: 'Paracetamol', dosage: '500 mg', frequency: 'Cada 8 horas', duration: '3 días' },
  { drugName: 'Ibuprofeno', dosage: '400 mg', frequency: 'Cada 8 horas', duration: '5 días' },
  { drugName: 'Diclofenaco', dosage: '50 mg', frequency: 'Cada 12 horas', duration: '5 días' },
  { drugName: 'Naproxeno', dosage: '250 mg', frequency: 'Cada 12 horas', duration: '5 días' },
  { drugName: 'Ácido acetilsalicílico', dosage: '100 mg', frequency: 'Cada 24 horas', duration: 'Continuo' },
  { drugName: 'Ketorolaco', dosage: '10 mg', frequency: 'Cada 8 horas', duration: '3 días' },

  // Antibióticos
  { drugName: 'Amoxicilina', dosage: '500 mg', frequency: 'Cada 8 horas', duration: '7 días' },
  { drugName: 'Amoxicilina + Ácido clavulánico', dosage: '875/125 mg', frequency: 'Cada 12 horas', duration: '7 días' },
  { drugName: 'Azitromicina', dosage: '500 mg', frequency: 'Cada 24 horas', duration: '3 días' },
  { drugName: 'Ciprofloxacino', dosage: '500 mg', frequency: 'Cada 12 horas', duration: '7 días' },
  { drugName: 'Cefalexina', dosage: '500 mg', frequency: 'Cada 6 horas', duration: '7 días' },
  { drugName: 'Claritromicina', dosage: '500 mg', frequency: 'Cada 12 horas', duration: '7 días' },
  { drugName: 'Metronidazol', dosage: '500 mg', frequency: 'Cada 8 horas', duration: '7 días' },
  { drugName: 'Trimetoprim + Sulfametoxazol', dosage: '800/160 mg', frequency: 'Cada 12 horas', duration: '7 días' },
  { drugName: 'Doxiciclina', dosage: '100 mg', frequency: 'Cada 12 horas', duration: '7 días' },
  { drugName: 'Nitrofurantoína', dosage: '100 mg', frequency: 'Cada 6 horas', duration: '5 días' },

  // Gastrointestinales
  { drugName: 'Omeprazol', dosage: '20 mg', frequency: 'Cada 24 horas', duration: '14 días' },
  { drugName: 'Pantoprazol', dosage: '40 mg', frequency: 'Cada 24 horas', duration: '14 días' },
  { drugName: 'Domperidona', dosage: '10 mg', frequency: 'Cada 8 horas', duration: '5 días' },
  { drugName: 'Metoclopramida', dosage: '10 mg', frequency: 'Cada 8 horas', duration: '3 días' },
  { drugName: 'Loperamida', dosage: '2 mg', frequency: 'Después de cada evacuación líquida', duration: '2 días' },
  { drugName: 'Butilhioscina', dosage: '10 mg', frequency: 'Cada 8 horas', duration: '3 días' },
  { drugName: 'Sales de rehidratación oral', dosage: '1 sobre', frequency: 'Según tolerancia', duration: '3 días' },

  // Antihistamínicos / alergias
  { drugName: 'Loratadina', dosage: '10 mg', frequency: 'Cada 24 horas', duration: '7 días' },
  { drugName: 'Cetirizina', dosage: '10 mg', frequency: 'Cada 24 horas', duration: '7 días' },
  { drugName: 'Desloratadina', dosage: '5 mg', frequency: 'Cada 24 horas', duration: '7 días' },
  { drugName: 'Clorfenamina', dosage: '4 mg', frequency: 'Cada 8 horas', duration: '5 días' },

  // Cardiovascular / antihipertensivos
  { drugName: 'Losartán', dosage: '50 mg', frequency: 'Cada 24 horas', duration: 'Continuo' },
  { drugName: 'Enalapril', dosage: '10 mg', frequency: 'Cada 12 horas', duration: 'Continuo' },
  { drugName: 'Amlodipino', dosage: '5 mg', frequency: 'Cada 24 horas', duration: 'Continuo' },
  { drugName: 'Atenolol', dosage: '50 mg', frequency: 'Cada 24 horas', duration: 'Continuo' },
  { drugName: 'Hidroclorotiazida', dosage: '25 mg', frequency: 'Cada 24 horas', duration: 'Continuo' },

  // Endocrino / metabólico
  { drugName: 'Metformina', dosage: '850 mg', frequency: 'Cada 12 horas', duration: 'Continuo' },
  { drugName: 'Glibenclamida', dosage: '5 mg', frequency: 'Cada 24 horas', duration: 'Continuo' },
  { drugName: 'Levotiroxina', dosage: '50 mcg', frequency: 'Cada 24 horas', duration: 'Continuo' },

  // Respiratorio
  { drugName: 'Salbutamol', dosage: '100 mcg inhalador', frequency: 'Cada 6-8 horas según necesidad', duration: '5 días' },
  { drugName: 'Ambroxol', dosage: '30 mg', frequency: 'Cada 8 horas', duration: '5 días' },
  { drugName: 'Prednisona', dosage: '20 mg', frequency: 'Cada 24 horas', duration: '5 días' },
  { drugName: 'Loratadina + Pseudoefedrina', dosage: '10/240 mg', frequency: 'Cada 24 horas', duration: '5 días' },

  // Dermatológicos
  { drugName: 'Betametasona', dosage: 'Crema tópica', frequency: 'Cada 12 horas', duration: '7 días' },
  { drugName: 'Clotrimazol', dosage: 'Crema tópica', frequency: 'Cada 12 horas', duration: '14 días' },

  // Vitaminas / suplementos
  { drugName: 'Complejo B', dosage: '1 tableta', frequency: 'Cada 24 horas', duration: '30 días' },
  { drugName: 'Ácido fólico', dosage: '5 mg', frequency: 'Cada 24 horas', duration: '30 días' },
  { drugName: 'Sulfato ferroso', dosage: '300 mg', frequency: 'Cada 24 horas', duration: '30 días' },
  { drugName: 'Vitamina C', dosage: '500 mg', frequency: 'Cada 24 horas', duration: '15 días' },
  { drugName: 'Vitamina D3', dosage: '2000 UI', frequency: 'Cada 24 horas', duration: '30 días' },
]
