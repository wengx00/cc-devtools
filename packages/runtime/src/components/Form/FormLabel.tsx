export function FormLabel(props: { label: string }) {
  return (
    <div
      style={{
        flexGrow: 1,
        flexShrink: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {props.label}
    </div>
  );
}
