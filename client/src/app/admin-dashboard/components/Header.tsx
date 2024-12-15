import { Button } from "@/components/ui/button";
import Link from "next/link";


const Header = () => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3 mb-8'>
				<Link href='/' className='rounded-lg'>
					<img src='/spotify.png' className='size-10 text-black' />
				</Link>
				<div>
					<h1 className='text-3xl font-bold'>Music Manager</h1>
					<p className='text-zinc-400 mt-1'>Manage your music catalog</p>
				</div>
			</div>
			<Button />
		</div>
	);
};
export default Header;
