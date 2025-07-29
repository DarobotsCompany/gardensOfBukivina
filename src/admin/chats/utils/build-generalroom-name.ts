export class BuildGeneralRoomId {
    private GENERAL_ROOM_ID: string

    constructor(adminId: number) {
        this.GENERAL_ROOM_ID = `generalRoom_${adminId}`;
    }

    public get getRoomName() : string {
        return this.GENERAL_ROOM_ID;
    }
}