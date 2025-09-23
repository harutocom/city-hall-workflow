import Image from 'next/image';
import TextEntry from '@/componets/featurses/TextEntry';
import Select from '@/componets/featurses/Select';
import TextArea from '@/componets/featurses/TextArea';
import Radio from '@/componets/featurses/Radio';
import Check from '@/componets/featurses/Check';
import Date from '@/componets/featurses/Date';
import DateRange from '@/componets/featurses/DateRange';

export default function Dashboard() {
  return <>
  <div className='flex flex-col gap-[16px]'>
    <TextEntry></TextEntry>
    <Select></Select>
    <Radio></Radio>
    <Check></Check>
    <Date></Date>
    <DateRange></DateRange>
  </div>
  </>;
}
