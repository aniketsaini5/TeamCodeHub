const UserCursor = ({ position, color, name }) => {
  if (!position) return null

  // Calculate position based on editor coordinates
  // This is a simplified version - you'll need to adjust based on your editor's DOM structure
  const style = {
    position: "absolute",
    left: `${position.left}px`,
    top: `${position.top}px`,
    pointerEvents: "none",
    zIndex: 10,
  }

  return (
    <div style={style} className="user-cursor">
      <div className="h-5 w-0.5 absolute" style={{ backgroundColor: color || "#ff00ff" }} />
      <div
        className="absolute px-1 py-0.5 text-xs text-white rounded-sm whitespace-nowrap"
        style={{
          backgroundColor: color || "#ff00ff",
          top: "-1.5rem",
          left: "0",
        }}
      >
        {name}
      </div>
    </div>
  )
}

const UserCursors = ({ cursors }) => {
  return (
    <div className="user-cursors">
      {Object.entries(cursors).map(([userId, data]) => (
        <UserCursor key={userId} position={data.position} color={data.color} name={data.name} />
      ))}
    </div>
  )
}

export default UserCursors
