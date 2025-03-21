import { TableCell, TableRow } from '@/components/ui/table'

type Props = { searchString: string }

export const NotFoundCell = ({ searchString }: Props) => (
  <TableRow>
    <TableCell colSpan={5} className="py-8 text-center">
      No cryptocurrencies found matching "{searchString}"
    </TableCell>
  </TableRow>
)
