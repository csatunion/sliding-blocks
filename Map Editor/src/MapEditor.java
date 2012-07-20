import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

@SuppressWarnings("serial")
public class MapEditor extends JFrame {

	private static MapEditor mapEditor;
	private JButton load, save, clear;
	private MapTile mapTiles1[][] = new MapTile[24][24];
	private MapTile mapTiles2[][] = new MapTile[24][24];
	private MapTile black, blue, brown, cyan, gray, green, lightgreen,
			lightred, orange, pink, puke, purple, red, white, yellow;
	private Dimension dimension = new Dimension(384, 384);
	private Dimension paletteDimesion = new Dimension(150, 300);

	public final int BLACK = 1;
	public final int BLUE = 0;
	public final int BROWN = 2;
	public final int CYAN = 3;
	public final int GRAY = 4;
	public final int GREEN = 5;
	public final int LIGHTGREEN = 6;
	public final int LIGHTRED = 7;
	public final int ORANGE = 8;
	public final int PINK = 9;
	public final int PUKE = 10;
	public final int PURPLE = 11;
	public final int RED = 12;
	public final int YELLOW = 13;
	public final int WHITE = 14;

	public ImageIcon blackTile = new ImageIcon(getClass().getResource("/black.png"));
	public ImageIcon blueTile = new ImageIcon(getClass().getResource("/blue.png"));
	public ImageIcon brownTile = new ImageIcon(getClass().getResource("/brown.png"));
	public ImageIcon cyanTile = new ImageIcon(getClass().getResource("/cyan.png"));
	public ImageIcon grayTile = new ImageIcon(getClass().getResource("/gray.png"));
	public ImageIcon greenTile = new ImageIcon(getClass().getResource("/green.png"));
	public ImageIcon ltgreenTile = new ImageIcon(getClass().getResource("/lightgreen.png"));
	public ImageIcon ltredTile = new ImageIcon(getClass().getResource("/lightred.png"));
	public ImageIcon orangeTile = new ImageIcon(getClass().getResource("/orange.png"));
	public ImageIcon pinkTile = new ImageIcon(getClass().getResource("/pink.png"));
	public ImageIcon pukeTile = new ImageIcon(getClass().getResource("/puke.png"));
	public ImageIcon purpleTile = new ImageIcon(getClass().getResource("/purple.png"));
	public ImageIcon redTile = new ImageIcon(getClass().getResource("/red.png"));
	public ImageIcon yellowTile = new ImageIcon(getClass().getResource("/yellow.png"));
	public ImageIcon whiteTile = new ImageIcon(getClass().getResource("/white.png"));
	

	private int brush = 0;
	private JLabel currentBrush;

	public int portal1 = 14;
	public int counter1 = 1;
	public int portal2 = 14;
	public int counter2 = 1;

	final JFileChooser saveChooser = new JFileChooser("C:/Users/Andrew/Desktop");
	final JFileChooser loadChooser = new JFileChooser("C:/Users/Andrew/Desktop");
	public File file;
	public boolean loading = false;

	public MapEditor() {
		super("Map Editor");

		setLayout(new BorderLayout());

		Container map1Contain = new Container();
		map1Contain.setLayout(new GridLayout(24, 24));
		map1Contain.setPreferredSize(dimension);
		add(map1Contain, BorderLayout.WEST);

		Container map2Contain = new Container();
		map2Contain.setLayout(new GridLayout(24, 24));
		map2Contain.setPreferredSize(dimension);
		add(map2Contain, BorderLayout.EAST);

		JPanel palettePanel = new JPanel(new FlowLayout());
		Container paletteContain = new Container();
		paletteContain.setLayout(new GridLayout(7, 2));
		paletteContain.setPreferredSize(paletteDimesion);
		palettePanel.add(paletteContain);
		currentBrush = new JLabel(blackTile);
		
		JPanel centerPanel = new JPanel(new BorderLayout());
		centerPanel.add(palettePanel, BorderLayout.CENTER);
		centerPanel.add(currentBrush, BorderLayout.SOUTH);
		
		add(centerPanel, BorderLayout.CENTER);
		

		IOListener ioListener = new IOListener();

		JPanel IOPanel = new JPanel(new FlowLayout());
		save = new JButton("SAVE");
		save.addActionListener(ioListener);
		load = new JButton("LOAD");
		load.addActionListener(ioListener);
		clear = new JButton("CLEAR");
		clear.addActionListener(ioListener);
		IOPanel.add(save);
		IOPanel.add(load);
		IOPanel.add(clear);
		add(IOPanel, BorderLayout.SOUTH);

		MapListener mapListener = new MapListener();

		for (int x = 0; x < 24; x++) {
			for (int y = 0; y < 24; y++) {
				if (y == 0 || y == 23 || x == 0 || x == 23) {
					mapTiles1[y][x] = new MapTile(1, 1);
					map1Contain.add(mapTiles1[y][x]);
				} else {
					mapTiles1[y][x] = new MapTile(0, 1);
					mapTiles1[y][x].addActionListener(mapListener);
					map1Contain.add(mapTiles1[y][x]);
				}

				if (y == 0 || y == 23 || x == 0 || x == 23) {
					mapTiles2[y][x] = new MapTile(1, 2);
					map2Contain.add(mapTiles2[y][x]);
				} else {
					mapTiles2[y][x] = new MapTile(0, 2);
					mapTiles2[y][x].addActionListener(mapListener);
					map2Contain.add(mapTiles2[y][x]);
				}
			}
		}

		PaletteListener paletteListener = new PaletteListener();

		black = new MapTile(BLACK);
		black.addActionListener(paletteListener);
		paletteContain.add(black);

		blue = new MapTile(BLUE);
		blue.addActionListener(paletteListener);
		paletteContain.add(blue);

		brown = new MapTile(BROWN);
		brown.addActionListener(paletteListener);
		paletteContain.add(brown);

		cyan = new MapTile(CYAN);
		cyan.addActionListener(paletteListener);
		paletteContain.add(cyan);

		gray = new MapTile(GRAY);
		gray.addActionListener(paletteListener);
		paletteContain.add(gray);

		green = new MapTile(GREEN);
		green.addActionListener(paletteListener);
		paletteContain.add(green);

		lightgreen = new MapTile(LIGHTGREEN);
		lightgreen.addActionListener(paletteListener);
		paletteContain.add(lightgreen);

		lightred = new MapTile(LIGHTRED);
		lightred.addActionListener(paletteListener);
		paletteContain.add(lightred);

		orange = new MapTile(ORANGE);
		orange.addActionListener(paletteListener);
		paletteContain.add(orange);

		pink = new MapTile(PINK);
		pink.addActionListener(paletteListener);
		paletteContain.add(pink);

		puke = new MapTile(PUKE);
		puke.addActionListener(paletteListener);
		paletteContain.add(puke);

		purple = new MapTile(PURPLE);
		purple.addActionListener(paletteListener);
		paletteContain.add(purple);

		red = new MapTile(RED);
		red.addActionListener(paletteListener);
		paletteContain.add(red);

		yellow = new MapTile(YELLOW);
		yellow.addActionListener(paletteListener);
		paletteContain.add(yellow);

		white = new MapTile(WHITE);
		white.addActionListener(paletteListener);
		paletteContain.add(white);

		saveChooser.setDialogTitle("Save");
		loadChooser.setDialogTitle("Load");
	}

	public static void main(String[] args) {
		mapEditor = new MapEditor();
		mapEditor.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		mapEditor.setSize(1000, 384);
		mapEditor.setResizable(false);
		mapEditor.setVisible(true);
	}

	private void clearMaps() {
		portal1 = 14;
		counter1 = 1;
		portal2 = 14;
		counter2 = 1;
		
		for (int x = 0; x < 24; x++) {
			for (int y = 0; y < 24; y++) {
				if (y == 0 || y == 23 || x == 0 || x == 23) {
					mapTiles1[y][x].setType(1);
				} else {
					mapTiles1[y][x].setType(0);
				}

				if (y == 0 || y == 23 || x == 0 || x == 23) {
					mapTiles2[y][x].setType(1);
				} else {
					mapTiles2[y][x].setType(0);
				}
			}
		}
	}

	private void setBrushPanel(){
		switch (brush) {
		case 1:
			currentBrush.setIcon(blackTile);
			currentBrush.setText("Box");
			break;
		case 0:
			currentBrush.setIcon(blueTile);
			currentBrush.setText("Nothing");
			break;
		case 2:
			currentBrush.setIcon(brownTile);
			currentBrush.setText("Ball Gate");
			break;
		case 3:
			currentBrush.setIcon(cyanTile);
			currentBrush.setText("Bouncy Box");
			break;
		case 4:
			currentBrush.setIcon(grayTile);
			currentBrush.setText("Teleporter");
			break;
		case 5:
			currentBrush.setIcon(greenTile);
			currentBrush.setText("Player 2");
			break;
		case 6:
			currentBrush.setIcon(ltgreenTile);
			currentBrush.setText("Player Button");
			break;
		case 7:
			currentBrush.setIcon(ltredTile);
			currentBrush.setText("Box Button");
			break;
		case 8:
			currentBrush.setIcon(orangeTile);
			currentBrush.setText("Goal");
			break;
		case 9:
			currentBrush.setIcon(pinkTile);
			currentBrush.setText("Player Gate");
			break;
		case 10:
			currentBrush.setIcon(pukeTile);
			currentBrush.setText("Ball Button");
			break;
		case 11:
			currentBrush.setIcon(purpleTile);
			currentBrush.setText("Ball");
			break;
		case 12:
			currentBrush.setIcon(redTile);
			currentBrush.setText("Player 1");
			break;
		case 13:
			currentBrush.setIcon(yellowTile);
			currentBrush.setText("Moving Box");
			break;
		default:
			currentBrush.setIcon(whiteTile);
			currentBrush.setText("Portal");
			break;
		}
		
	}

	private class PaletteListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			brush = ((MapTile) e.getSource()).getType();
			setBrushPanel();
		}
	}

	private class MapListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			((MapTile) e.getSource()).setType(brush);
		}
	}

	private class IOListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			if (((JButton) e.getSource()).equals(clear)) {
				int choice = JOptionPane.showConfirmDialog(mapEditor,
						"Are You sure?", "Clear Map",
						JOptionPane.OK_CANCEL_OPTION);
				if (choice == JOptionPane.OK_OPTION)
					clearMaps();
			}
			if (((JButton) e.getSource()).equals(save)) {
				int choice = saveChooser.showOpenDialog(mapEditor);
				if (choice == JFileChooser.APPROVE_OPTION) {
					file = saveChooser.getSelectedFile();

					String[][] output1 = new String[24][24];
					String[][] output2 = new String[24][24];
					for (int i = 0; i < 24; i++) {
						for (int j = 0; j < 24; j++) {
							output1[j][i] = Integer.toString(mapTiles1[j][i]
									.getType());
							output2[j][i] = Integer.toString(mapTiles2[j][i]
									.getType());
						}
					}

					try {
						if (!file.exists())
							file.createNewFile();
						PrintWriter out = new PrintWriter(new FileWriter(file));
						out.print("[");
						for (int i = 0; i < 24; i++) {
							out.print("[");
							for (int j = 0; j < 24; j++) {
								if (j == 23) {
									out.print(output1[j][i]);
									out.print("]");
									if(i != 23)
										out.print(",");
									else
										out.print("]");
								} else
									out.print(output1[j][i] + ",");
							}
							out.println();
						}

						out.println();
						out.print("[");
						for (int x = 0; x < 24; x++) {
							out.print("[");
							for (int y = 0; y < 24; y++) {
								if (y == 23) {
									out.print(output2[y][x]);
									out.print("]");
									if(x != 23)
										out.print(",");
									else
										out.print("]");
								} else
									out.print(output2[y][x] + ",");

							}
							out.println();
						}
						out.close();
					} catch (IOException e1) {
						e1.printStackTrace();
					}

				}
			}
			if (((JButton) e.getSource()).equals(load)) {
				int choice = loadChooser.showOpenDialog(mapEditor);
				if (choice == JFileChooser.APPROVE_OPTION) {
					file = loadChooser.getSelectedFile();

					String input;
					loading = true;
					try {
						input = readFile(file);
						int index = input.indexOf("[[");
						input = input.substring(index+1);
						index = input.indexOf("]]");
						input = input.substring(0, index) + input.substring(index + 1);
						index = input.indexOf("[[");
						input = input.substring(0, index-1) + input.substring(index+1);
						index = input.indexOf("]]");
						input = input.substring(0, index) + input.substring(index+1);
						input = input.replace("[", ",").replace("]", ",");

						Scanner scanner = new Scanner(input);
						scanner.useDelimiter(",");
						
						for (int i = 0; i < 24; i++) {
							for (int j = 0; j < 24; j++) {
								mapTiles1[j][i].setType(scanner.nextInt());
							}
							scanner.nextLine();
						}
						scanner.nextLine();
						for (int i = 0; i < 24; i++) {
							for (int j = 0; j < 24; j++) {
								mapTiles2[j][i].setType(scanner.nextInt());
							}
							scanner.nextLine();
						}
						scanner.close();
					} catch (IOException e1) {
						e1.printStackTrace();
					}
					loading = false;
				}
			}
		}
	}

	private String readFile(File file) throws IOException {

		StringBuilder fileContents = new StringBuilder((int) file.length());
		Scanner scanner = new Scanner(file);
		String lineSeparator = System.getProperty("line.separator");

		try {
			while (scanner.hasNextLine()) {
				fileContents.append(scanner.nextLine() + lineSeparator);
			}
			return fileContents.toString();
		} finally {
			scanner.close();
		}
	}

	private class MapTile extends JButton {

		int type;
		int map;

		public MapTile(int type) {
			this.type = type;
			setType(type);
		}

		public MapTile(int type, int map) {
			this.type = type;
			this.map = map;
			setType(type);
		}
		

		public void setType(int type) {
			
			this.type = type;

			switch (type) {
			case 1:
				setIcon(blackTile);
				break;
			case 0:
				setIcon(blueTile);
				break;
			case 2:
				setIcon(brownTile);
				break;
			case 3:
				setIcon(cyanTile);
				break;
			case 4:
				setIcon(grayTile);
				break;
			case 5:
				setIcon(greenTile);
				break;
			case 6:
				setIcon(ltgreenTile);
				break;
			case 7:
				setIcon(ltredTile);
				break;
			case 8:
				setIcon(orangeTile);
				break;
			case 9:
				setIcon(pinkTile);
				break;
			case 10:
				setIcon(pukeTile);
				break;
			case 11:
				setIcon(purpleTile);
				break;
			case 12:
				setIcon(redTile);
				break;
			case 13:
				setIcon(yellowTile);
				break;
			default:
				setIcon(whiteTile);
				if(loading = true){
					if (map == 1) {
						counter1++;
						if (counter1 == 3) {
							portal1++;
							counter1 = 1;
						}
					}
					if (map == 2) {
						counter2++;
						if (counter2 == 3) {
							portal2++;
							counter2 = 1;
						}
					}
				}else{
					if (map == 1) {
						this.type = portal1;
						counter1++;
						if (counter1 == 3) {
							portal1++;
							counter1 = 1;
						}
					}
					if (map == 2) {
						this.type = portal2;
						counter2++;
						if (counter2 == 3) {
							portal2++;
							counter2 = 1;
						}
					}
				}
				
				break;
			}
		}
		

		public int getType() {
			return type;
		}
	}
}
