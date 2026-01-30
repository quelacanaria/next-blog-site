"use client";
import { faEllipsis, faEllipsisVertical, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DropDownSize = 'xs'|'sm'|'md'|'lg';
type DropDownItem = { label: string; onClick?: ()=>void;}
interface DropDownProps {
    buttonLabel:string;
    items:DropDownItem[];
    sizes?:DropDownSize;
}
const sizeClasses:Record<DropDownSize, string>={
 xs:'btn-xs',
 sm:'btn-sm',
 md:'btn-md',
 lg:'btn-lg',
};

const iconSizes:Record<DropDownSize, any>={
  xs: 'xs',
  sm: 'sm',
  md: 'lg',
  lg: 'x2'
}

export default function Dropdown({buttonLabel, items, sizes='md'}:DropDownProps) {
  return (
    <>
    <div className="dropdown dropdown-bottom dropdown-end" >
      <button className={`btn ${sizeClasses[sizes]} btn-primary btn-soft btn-circle`} tabIndex={0}><FontAwesomeIcon icon={faEllipsisVertical} size={iconSizes[sizes]} />
        {buttonLabel && <span className="ml-2">{buttonLabel}</span>}
      </button>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow-sm">
        {items.map((item, index) => (
          <li key={index}>
            <button type="button" onClick={item.onClick}>{item.label}</button>
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}
