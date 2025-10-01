import Check from "@/componets/featurses/Check";
import Date from "@/componets/featurses/Date";
import DateRange from "@/componets/featurses/DateRange";
import Radio from "@/componets/featurses/Radio";
import Select from "@/componets/featurses/Select";
import TextEntry from "@/componets/featurses/TextEntry";

export default function Dashboard() {
  return <>
  <div className="flex flex-col gap-[8px]">
    <Check></Check>
    <Date></Date>
    <DateRange></DateRange>
    <Radio></Radio>
    <Select></Select>
    <TextEntry></TextEntry>
  </div>
  </>;
}
