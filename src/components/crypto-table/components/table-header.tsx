import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const CryptoTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="w-[80px]">Rank</TableHead>
      <TableHead>Name</TableHead>
      <TableHead className="text-right">Price</TableHead>
      <TableHead className="text-right">Market Cap</TableHead>
    </TableRow>
  </TableHeader>
)
