import { SearchIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from "../ui/input-group";

export default function SearchBar() {
	return (
		<InputGroup className="h-10 w-full rounded-xl">
			{/* TEXT INPUT */}
			<InputGroupInput
				placeholder="جستجو"
				className="
					p-0
					placeholder:text-base
					placeholder:font-medium
					placeholder:text-[#DDDCDB]
				"
			/>

			{/* ICON ADDON */}
			<InputGroupAddon className="pr-2!">
				<SearchIcon className="h-6! w-6! text-[#DDDCDB]" />
			</InputGroupAddon>
		</InputGroup>
	);
}
