/**
 * Mock species data for GenomeSelector component
 * This data structure will be replaced with API calls in the future
 */

export interface AssemblyOption {
    id: string
    name: string
    description?: string
}

export interface SpeciesData {
    id: string
    name: string
    scientificName: string
    defaultAssemblyId: string
    commonAssemblies: AssemblyOption[]
}

export const MOCK_SPECIES_DATA: SpeciesData[] = [
    {
        id: 'human',
        name: 'Human',
        scientificName: 'Homo sapiens',
        defaultAssemblyId: 'hg38',
        commonAssemblies: [
            {
                id: 'hg38',
                name: 'GRCh38/hg38',
                description: 'Dec. 2013',
            },
            {
                id: 'hg19',
                name: 'GRCh37/hg19',
                description: 'Feb. 2009',
            },
            {
                id: 't2t-chm13-v2',
                name: 'T2T-CHM13v2.0',
                description: 'Jan. 2022',
            },
        ],
    },
    {
        id: 'mouse',
        name: 'Mouse',
        scientificName: 'Mus musculus',
        defaultAssemblyId: 'mm10',
        commonAssemblies: [
            {
                id: 'mm39',
                name: 'GRCm39/mm39',
                description: 'Jun. 2020',
            },
            {
                id: 'mm10',
                name: 'GRCm38/mm10',
                description: 'Dec. 2011',
            },
        ],
    },
    {
        id: 'rat',
        name: 'Rat',
        scientificName: 'Rattus norvegicus',
        defaultAssemblyId: 'rn7',
        commonAssemblies: [
            {
                id: 'rn7',
                name: 'mRatBN7.2/rn7',
                description: 'Nov. 2020',
            },
            {
                id: 'rn6',
                name: 'RGSC 6.0/rn6',
                description: 'Jul. 2014',
            },
        ],
    },
    {
        id: 'zebrafish',
        name: 'Zebrafish',
        scientificName: 'Danio rerio',
        defaultAssemblyId: 'danRer11',
        commonAssemblies: [
            {
                id: 'danRer11',
                name: 'GRCz11/danRer11',
                description: 'May 2017',
            },
            {
                id: 'danRer10',
                name: 'GRCz10/danRer10',
                description: 'Sep. 2014',
            },
        ],
    },
    {
        id: 'fruitfly',
        name: 'Fruitfly',
        scientificName: 'Drosophila melanogaster',
        defaultAssemblyId: 'dm6',
        commonAssemblies: [
            {
                id: 'dm6',
                name: 'BDGP Release 6/dm6',
                description: 'Aug. 2014',
            },
        ],
    },
    {
        id: 'yeast',
        name: 'Yeast',
        scientificName: 'Saccharomyces cerevisiae',
        defaultAssemblyId: 'sacCer3',
        commonAssemblies: [
            {
                id: 'sacCer3',
                name: 'SacCer_Apr2011/sacCer3',
                description: 'Apr. 2011',
            },
        ],
    },
]
